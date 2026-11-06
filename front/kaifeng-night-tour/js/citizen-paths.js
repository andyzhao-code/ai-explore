/* 行人脚点始终落在桥面、岸墙或木台表面；位移与步态共用同一时间。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SongCitizenPaths = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function arch(x) {
    return 2.1 + 4.8 * Math.pow(Math.max(0, 1 - (x / 19) ** 2), 0.9);
  }

  function slopeAt(x) {
    const dx = 0.4;
    return (arch(x + dx) - arch(x - dx)) / (2 * dx);
  }

  function deckTop(x) {
    return arch(x) + 0.11 / Math.sqrt(1 + slopeAt(x) ** 2);
  }

  const BRIDGE_Z = -41;
  const BRIDGE_X0 = -12;
  const BRIDGE_X1 = 12;
  const BANK_X = 18.9;
  const BANK_Y = 1.55;
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
        x: 0,
        z: i % 2 ? BRIDGE_Z + 0.55 : BRIDGE_Z - 0.55,
        side: 0,
        speed: 0.18 + (i % 3) * 0.025,
        phase: t * (BRIDGE_X1 - BRIDGE_X0) + (i % 2 ? BRIDGE_X1 - BRIDGE_X0 : 0),
        gait: i * 1.73,
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
            gait: (i + segmentIndex * 2 + (side > 0 ? 1 : 0)) * 1.31,
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
      y: 1.25,
      z: -76,
      side: 1,
      speed: 0,
      phase: 0,
      gait: 0,
      z0: 0,
      z1: 0
    });
    return people;
  }

  function patrol(start, end, phase, speed, time) {
    const span = end - start;
    const travel = ((phase + time * speed) % (span * 2) + span * 2) % (span * 2);
    const forward = travel <= span;
    return {
      position: start + (forward ? travel : span * 2 - travel),
      direction: forward ? 1 : -1
    };
  }

  function pose(person, time) {
    const walkPhase = person.speed ? time * 3.6 + person.gait : 0;
    const walkStrength = person.speed ? 1 : 0;
    if (person.place === 'bridge') {
      const route = patrol(BRIDGE_X0, BRIDGE_X1, person.phase, person.speed, time);
      return {
        x: route.position,
        y: deckTop(route.position),
        z: person.z,
        yaw: route.direction * 0.14,
        slope: slopeAt(route.position),
        walkPhase,
        walkStrength
      };
    }
    if (person.place === 'platform') {
      return {
        x: person.x,
        y: person.y,
        z: person.z,
        yaw: person.side > 0 ? -Math.PI / 2 : Math.PI / 2,
        slope: 0,
        walkPhase: 0,
        walkStrength: 0
      };
    }
    const route = patrol(person.z0, person.z1, person.phase, person.speed, time);
    return {
      x: person.x,
      y: BANK_Y,
      z: route.position,
      yaw: person.side > 0 ? -Math.PI / 2 : Math.PI / 2,
      slope: 0,
      walkPhase,
      walkStrength
    };
  }

  return { arch, deckTop, roster, pose, BRIDGE_Z, BANK_X, BANK_Y };
});
