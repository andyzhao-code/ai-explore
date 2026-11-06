/* 行人只允许出现在桥面中线、岸墙内侧和砧台顶面。
   脚点就是世界坐标，不绕身体中心旋转，也不做上下踏步。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SongCitizenPaths = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  // 与场景里虹桥拱线同一公式
  function arch(x) {
    return 2.1 + 4.8 * Math.pow(Math.max(0, 1 - (x / 19) ** 2), 0.9);
  }

  // 桥板中心在 arch(x)，板厚 0.22，再留 2 厘米避免和板面闪烁
  function deckTop(x) {
    const dx = 0.4;
    const slope = (arch(x + dx) - arch(x - dx)) / (2 * dx);
    const cos = 1 / Math.sqrt(1 + slope * slope);
    return arch(x) + 0.11 * cos + 0.02;
  }

  const BRIDGE_Z = -41;
  const BANK_X = 18.9;
  const BANK_Y = 1.56;
  const QUAY = [
    { z0: -168, z1: -50, speed: 0.24 },
    { z0: -30, z1: 8, speed: 0.2 }
  ];

  function roster(mobile) {
    const people = [];
    const bridgeN = mobile ? 5 : 9;
    const bridgeKinds = [0, 1, 3, 4, 5, 0, 1, 3, 4];
    for (let i = 0; i < bridgeN; i++) {
      const t = (i + 0.5) / bridgeN;
      people.push({
        place: 'bridge',
        kind: bridgeKinds[i % bridgeKinds.length],
        x: -12 + t * 24,
        z: i % 2 ? BRIDGE_Z + 0.45 : BRIDGE_Z - 0.45,
        side: 0,
        speed: 0,
        phase: 0,
        z0: 0,
        z1: 0
      });
    }
    const perSide = mobile ? 3 : 6;
    for (const side of [-1, 1]) {
      QUAY.forEach((segment, segmentIndex) => {
        const count = segmentIndex === 0 ? perSide : Math.max(2, Math.ceil(perSide / 2));
        const span = segment.z1 - segment.z0;
        for (let i = 0; i < count; i++) {
          people.push({
            place: 'bank',
            kind: (i + segmentIndex + (side > 0 ? 2 : 0)) % 6,
            x: side * BANK_X,
            z: 0,
            side,
            speed: segment.speed,
            phase: ((i + 0.35) / count) * span,
            z0: segment.z0,
            z1: segment.z1
          });
        }
      });
    }
    people.push({
      place: 'platform',
      kind: 2,
      x: 12.2,
      y: 1.26,
      z: -76,
      side: 1,
      speed: 0,
      phase: 0,
      z0: 0,
      z1: 0
    });
    return people;
  }

  // 返回脚底位置和朝向。桥上的人站定，岸上只沿岸平移。
  function pose(person, time) {
    if (person.place === 'bridge') {
      return { x: person.x, y: deckTop(person.x), z: person.z, yaw: 0 };
    }
    if (person.place === 'platform') {
      return { x: person.x, y: person.y, z: person.z, yaw: person.side > 0 ? -Math.PI / 2 : Math.PI / 2 };
    }
    const span = person.z1 - person.z0;
    const travel = person.speed ? ((person.phase + time * person.speed) % span + span) % span : person.phase;
    return {
      x: person.x,
      y: BANK_Y,
      z: person.z0 + travel,
      yaw: person.side > 0 ? -Math.PI / 2 : Math.PI / 2
    };
  }

  return { arch, deckTop, roster, pose, BRIDGE_Z, BANK_X, BANK_Y };
});
