/* 汴京行人。立绘脚底锚在可行走表面上，不做踏步起伏。 */
window.createSongCitizens = function createSongCitizens(THREE, scene, options) {
  const paths = window.SongCitizenPaths;
  const mobile = options.mobile;
  const people = paths.roster(mobile);
  const count = people.length;
  const planeH = 1.72;
  const planeW = planeH * (780 / 980);

  const loader = new THREE.TextureLoader();
  const map = loader.load('assets/citizens.webp');
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const material = new THREE.MeshStandardMaterial({
    map,
    alphaTest: 0.45,
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
        '#include <uv_pars_vertex>\nattribute float figureKind;'
      )
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
#ifdef USE_MAP
  vMapUv.x = (vMapUv.x + figureKind) / 6.0;
#endif`
      );
  };
  material.customProgramCacheKey = () => 'song-citizen-v2';

  // 几何体底边就是脚，旋转时不会把脚甩离地面
  const geometry = new THREE.PlaneGeometry(planeW, planeH);
  geometry.translate(0, planeH / 2, 0);
  const kinds = new Float32Array(count);
  people.forEach((person, index) => { kinds[index] = person.kind; });
  geometry.setAttribute('figureKind', new THREE.InstancedBufferAttribute(kinds, 1));

  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const dummy = new THREE.Object3D();

  function update(time, reduced) {
    const clock = reduced ? 0 : time;
    for (let i = 0; i < count; i++) {
      const foot = paths.pose(people[i], clock);
      dummy.position.set(foot.x, foot.y, foot.z);
      dummy.rotation.set(0, foot.yaw, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  function setDay(daylight) {
    material.emissiveIntensity = THREE.MathUtils.lerp(0.1, 0.03, daylight);
  }

  return { update, setDay, count };
};
