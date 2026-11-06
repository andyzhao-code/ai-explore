/* 汴京行人：六种宋代真人立绘，替代方块木偶。
   同一张图集实例化，朝向镜头，避免上百个独立蒙皮。 */
window.createSongCitizens = function createSongCitizens(THREE, scene, options) {
  const mobile = options.mobile;
  const rand = options.rand;
  const range = options.range;
  const arch = options.arch;
  const count = mobile ? 32 : 64;
  const planeH = 1.86;
  const planeW = planeH * (780 / 980);

  const loader = new THREE.TextureLoader();
  const map = loader.load('assets/citizens.webp');
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  map.generateMipmaps = true;

  // 立绘按列排开，实例用 figureKind 选取其中一列
  const material = new THREE.MeshStandardMaterial({
    map,
    alphaTest: 0.42,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#fff4e4'),
    emissiveMap: map,
    emissiveIntensity: 0.16
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
  material.customProgramCacheKey = () => 'song-citizen-v1';

  const geometry = new THREE.PlaneGeometry(1, 1);
  const kinds = new Float32Array(count);
  const people = [];
  for (let i = 0; i < count; i++) {
    const bridge = i < (mobile ? 8 : 16);
    const side = i % 2 ? 1 : -1;
    // 小孩少一些，其余文士、女子、货郎、官吏、市女轮换
    const kind = i % 9 === 0 ? 5 : i % 5;
    kinds[i] = kind;
    people.push({
      kind,
      bridge,
      side,
      x: side * range(15.4, 17.6),
      z: range(-185, 28),
      phase: rand() * 6.28,
      speed: i % 11 === 0 ? 0 : range(0.16, 0.42)
    });
  }
  // 铁花砧边留一个站定的货郎，不再使用方块铁匠
  people[count - 1].bridge = false;
  people[count - 1].speed = 0;
  people[count - 1].x = 10.6;
  people[count - 1].z = -75.6;
  people[count - 1].side = 1;
  kinds[count - 1] = 2;

  geometry.setAttribute('figureKind', new THREE.InstancedBufferAttribute(kinds, 1));
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.renderOrder = 2;
  scene.add(mesh);

  const dummy = new THREE.Object3D();

  function update(time, camera, reduced) {
    for (let i = 0; i < count; i++) {
      const person = people[i];
      const moving = person.speed && !reduced;
      const along = moving ? ((person.z + 190 + time * person.speed * person.side) % 220 + 220) % 220 - 190 : person.z;
      const x = person.bridge ? Math.sin(person.phase + time * 0.018) * 16.2 : person.x;
      const z = person.bridge ? -41 + Math.sin(person.phase) * 1.4 : along;
      const ground = person.bridge ? arch(x) + 0.18 : 1.56;
      const step = moving ? Math.sin(time * 2.4 + person.phase) : 0;
      dummy.position.set(x, ground + planeH * 0.5 + step * 0.025, z);
      // 平面正面朝 +Z，加半圈后正对镜头，避免看到镜像背面
      const yaw = Math.atan2(camera.position.x - x, camera.position.z - z);
      dummy.rotation.set(0, yaw + Math.PI, step * 0.035);
      dummy.scale.set(planeW, planeH, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  function setDay(daylight) {
    material.emissiveIntensity = THREE.MathUtils.lerp(0.2, 0.04, daylight);
  }

  return { update, setDay, count };
};
