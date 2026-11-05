/* 把滚动和指针写成 CSS 变量，供气氛层做轻微视差。
   不改章节进度、诗笺和放灯逻辑。 */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const forceReduce = new URLSearchParams(location.search).get('motion') === 'reduce';

  // 系统或地址参数要求减少动态时，不再写入位移
  const reduced = () => forceReduce || reduceQuery.matches;
  if (reduced()) return;

  const chapters = [...document.querySelectorAll('.chapter')];
  let mx = 0;
  let my = 0;
  let raf = 0;

  // 仅鼠标产生横向视线，触控滚动不带动整页平移
  addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    mx += ((event.clientX / innerWidth - 0.5) - mx) * 0.18;
    my += ((event.clientY / innerHeight - 0.5) - my) * 0.18;
  }, { passive: true });

  function frame() {
    raf = 0;
    root.style.setProperty('--mx', mx.toFixed(4));
    root.style.setProperty('--my', my.toFixed(4));
    const y = scrollY;
    for (const chapter of chapters) {
      const height = chapter.offsetHeight || 1;
      const local = (y + innerHeight * 0.42 - chapter.offsetTop) / height;
      const lift = Math.max(-0.2, Math.min(1.15, local));
      chapter.style.setProperty('--lift', lift.toFixed(3));
    }
  }

  function requestFrame() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', requestFrame);
  requestFrame();
})();
