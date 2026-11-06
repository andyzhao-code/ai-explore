const assert = require('assert');
const paths = require('./citizen-paths.js');

const { roster, pose, deckTop, arch, BRIDGE_Z } = paths;

function checkPose(person, time) {
  const p = pose(person, time);
  assert.ok(Number.isFinite(p.x + p.y + p.z + p.yaw + p.slope + p.walkPhase), '坐标和步态必须是有限数');
  if (person.place === 'bridge') {
    assert.ok(Math.abs(p.x) <= 12, '桥上的人不能靠近桥台：' + p.x);
    assert.ok(Math.abs(p.z - BRIDGE_Z) <= 0.7, '桥上的人必须留在两侧栏杆之内：' + p.z);
    assert.ok(Math.abs(p.y - deckTop(p.x)) < 1e-6, '脚底必须逐帧贴住拱桥桥面');
    assert.strictEqual(p.walkStrength, 1, '桥上行人必须有步态');
  } else if (person.place === 'bank') {
    assert.ok(Math.abs(Math.abs(p.x) - 18.9) < 1e-6, '岸上的人必须站在栏杆内侧的岸墙顶');
    assert.ok(p.z >= -168 && p.z <= -50 || p.z >= -30 && p.z <= 8, '岸上的人不能穿过虹桥或水门：' + p.z);
    assert.strictEqual(p.y, 1.55, '脚底必须落在岸墙顶面');
    assert.strictEqual(p.slope, 0);
  } else if (person.place === 'platform') {
    assert.ok(p.x > 9 && p.x < 15 && p.z < -73 && p.z > -79, '砧台人物必须站在木台上');
    assert.strictEqual(p.y, 1.25, '脚底必须落在木台顶面');
    assert.strictEqual(p.walkStrength, 0, '站定的人不做行走摆动');
  } else {
    assert.fail('未知落点');
  }
  return p;
}

for (const mobile of [false, true]) {
  const people = roster(mobile);
  assert.ok(people.length > 0);
  for (const person of people) {
    const first = checkPose(person, 0);
    const later = checkPose(person, 12.5);
    const muchLater = checkPose(person, 40);
    if (person.place === 'platform') {
      assert.deepStrictEqual(later, first, '站定的人不能随时间漂起或滑走');
      assert.deepStrictEqual(muchLater, first);
    } else {
      assert.strictEqual(later.y, person.place === 'bank' ? first.y : deckTop(later.x), '行走路径不能产生额外上下起伏');
      assert.strictEqual(later.x, person.place === 'bank' ? first.x : later.x);
      assert.notStrictEqual(person.place === 'bank' ? later.z : later.x, person.place === 'bank' ? first.z : first.x, '行人必须沿路径行走');
    }
  }
}

assert.ok(deckTop(0) > arch(0), '桥面落脚点要高于拱线中心');
assert.ok(Math.abs(deckTop(0) - (arch(0) + 0.11)) < 0.001, '脚点应与桥板顶面一致，不再额外抬高');
console.log('citizen path checks passed', roster(false).length, 'desktop', roster(true).length, 'mobile');
