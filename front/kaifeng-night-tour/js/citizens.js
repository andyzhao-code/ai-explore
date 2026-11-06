/* 宋制人物立绘：保持原图比例，以脚底为锚点，行走时只轻摆下身。 */
window.createSongCitizens = function createSongCitizens(THREE, scene, options) {
  const paths = window.SongCitizenPaths;
  const mobile = options.mobile;
  const people = paths.roster(mobile);
  const count = people.length;
  const planeH = 1.72;
  const planeW = planeH * (780 / 980);
  const footInset = planeH * (8 / 980);

  const loader = new THREE.TextureLoader();
  const map = loader.load('assets/citizens.webp');
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const material = new THREE.MeshStandardMaterial({
    map,
    alphaTest: 0.35,
    roughness: 0.92,
    metalness: 0,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#fff1df'),
    emissiveMap: map,
    emissiveIntensity: 0.08
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <uv_pars_vertex>',
        '#include <uv_pars_vertex>\nattribute float figureKind;\nattribute float walkPhase;\nattribute float walkStrength;\nattribute float groundSlope;'
      )
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
#ifdef USE_MAP
  vMapUv.x = (vMapUv.x + figureKind) / 6.0;
#endif`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
float legMask = 1.0 - smoothstep(0.10, 0.64, position.y);
float footMask = 1.0 - smoothstep(0.02, 0.22, position.y);
float upperMask = smoothstep(0.55, 1.50, position.y);
float legSide = smoothstep(-0.06, 0.06, position.x) * 2.0 - 1.0;
float stride = sin(walkPhase) * legSide;
transformed.x += stride * 0.052 * legMask * walkStrength;
transformed.y += max(0.0, stride) * 0.016 * legMask * walkStrength;
transformed.y += groundSlope * transformed.x * footMask;
transformed.x += sin(walkPhase * 2.0) * 0.008 * upperMask * walkStrength;`
      );
  };
  material.customProgramCacheKey = () => 'song-citizen-v3-grounded-walk';

  const geometry = new THREE.PlaneGeometry(planeW, planeH, 12, 24);
  geometry.translate(0, planeH / 2, 0);
  const kinds = new Float32Array(count);
  const strengths = new Float32Array(count);
  const phases = new Float32Array(count);
  const slopes = new Float32Array(count);
  people.forEach((person, index) => {
    kinds[index] = person.kind;
    strengths[index] = person.speed ? 1 : 0;
  });
  geometry.setAttribute('figureKind', new THREE.InstancedBufferAttribute(kinds, 1));
  geometry.setAttribute('walkStrength', new THREE.InstancedBufferAttribute(strengths, 1));
  const phaseAttribute = new THREE.InstancedBufferAttribute(phases, 1).setUsage(THREE.DynamicDrawUsage);
  const slopeAttribute = new THREE.InstancedBufferAttribute(slopes, 1).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('walkPhase', phaseAttribute);
  geometry.setAttribute('groundSlope', slopeAttribute);

  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 64;
  const context = shadowCanvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 31);
  gradient.addColorStop(0, 'rgba(0,0,0,0.62)');
  gradient.addColorStop(0.45, 'rgba(0,0,0,0.26)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const shadowGeometry = new THREE.PlaneGeometry(1, 1);
  shadowGeometry.rotateX(-Math.PI / 2);
  const shadowMesh = new THREE.InstancedMesh(
    shadowGeometry,
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      toneMapped: false
    }),
    count
  );
  shadowMesh.frustumCulled = false;
  scene.add(shadowMesh);

  const dummy = new THREE.Object3D();
  const shadowDummy = new THREE.Object3D();

  function update(time, reduced) {
    const clock = reduced ? 0 : time;
    for (let i = 0; i < count; i++) {
      const foot = paths.pose(people[i], clock);
      dummy.position.set(foot.x, foot.y - footInset, foot.z);
      dummy.rotation.set(0, foot.yaw, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      shadowDummy.position.set(foot.x, foot.y + 0.006, foot.z);
      shadowDummy.rotation.set(0, 0, Math.atan(foot.slope));
      shadowDummy.scale.set(0.68, 1, 0.34);
      shadowDummy.updateMatrix();
      shadowMesh.setMatrixAt(i, shadowDummy.matrix);
      phases[i] = foot.walkPhase;
      slopes[i] = foot.slope;
    }
    mesh.instanceMatrix.needsUpdate = true;
    shadowMesh.instanceMatrix.needsUpdate = true;
    phaseAttribute.needsUpdate = true;
    slopeAttribute.needsUpdate = true;
  }

  function setDay(daylight) {
    material.emissiveIntensity = THREE.MathUtils.lerp(0.08, 0.02, daylight);
    shadowMesh.material.opacity = THREE.MathUtils.lerp(0.26, 0.38, daylight);
  }

  return { update, setDay, count };
};
