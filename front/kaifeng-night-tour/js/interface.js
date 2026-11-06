/* 汴灯 — 仅中文的界面、诗笺与放灯。
   不再切换语言，白昼文案只覆盖对应中文条目。 */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const copy = {
    title: '汴灯 — 循一河灯火，入一夜汴京',
    description: '循一河灯火，入一夜汴京。五章宋韵夜游，一卷可漫步的诗。',
    skip: '跳至夜游正文',
    navigation: '章节导航',
    progress: '夜游进度',
    next: '下一章',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    contents: '夜游 · 五章',
    nav0: '入城', nav1: '过桥', nav2: '寻市', nav3: '听诗', nav4: '放灯',
    chapter0: '水门初见', chapter1: '虹桥灯渡', chapter2: '长街如昼', chapter3: '临水听诗', chapter4: '万灯归河',
    heroKicker: '一卷宋韵 · 一夜汴京',
    heroCopy: '循一河灯火，入一夜汴京。<br>让失落在画卷里的繁华，再为你亮一次。',
    enter: '循光入卷', enterNote: '向下滚动，启程',
    vertical0: '灯火照河山 · 人间入画来',
    nightLabel: '汴河夜色',
    scrollNote: '一河 · 五章 · 千灯',
    tag1: '以桥为渡', heading1: '虹桥|灯渡',
    copy1: '桥上，是未歇的人间。<br>桥下，是流动的星河。<br>一盏灯，接住一位夜归人。',
    discover: '拾起桥边的一句诗',
    source0: '辛弃疾 · 南宋《青玉案·元夕》',
    readMore: '到水边，继续读诗 →',
    card1: '虹桥 · 水与城的相逢',
    vertical1: '一桥飞架 · 两岸灯明',
    tag2: '烟火人间', heading2: '长街|如昼',
    copy2: '茶香穿过绸帘，笑语漫过屋檐。<br>卖花声里，夜还很长。<br>此刻的繁华，都是寻常。',
    tea: '一盏茶', silk: '一匹绢', boat: '一叶舟',
    marketPoem: '“市列珠玑，户盈罗绮”',
    marketLabel: '沿河街市 / 灯下百业',
    vertical2: '一街烟火 · 万家寻常',
    tag3: '把夜读慢', heading3: '临水|听诗',
    copy3: '暂借一方亭。<br>把喧嚣留在远岸，<br>把一阕词，留给自己。',
    card2: '一盏茶的时间，让夜色停一停。',
    poetryShelf: '临水诗笺',
    choosePoem: '选择诗词',
    poemTitle0: '青玉案 · 元夕',
    poemTitle1: '望海潮',
    poemHint: '轻点一句，将它留作你的灯笺。',
    carry: '携此句，去放灯',
    tag4: '让心事升空', heading4: '万灯|归河',
    copy4: '一城灯火，半卷人间。<br>愿今夜的光，照见你的远方。',
    yourVerse: '你的灯笺',
    release: '放一盏灯',
    releasing: '灯正升空',
    released: '灯已升空。愿有所念，皆有所光。',
    releaseAgain: '再放一盏灯',
    changeVerse: '换一句诗',
    vertical4: '愿有所念 · 皆有所光',
    manifesto: '不是回到过去，<br>是让一座城的温柔，再发生一次。',
    return: '重入画卷',
    credits: '以《清明上河图》的城市意象为灵感，融入宋词与当代想象。<br>此为宋韵夜游的艺术演绎，并非历史场景的精确复原。插图为 AI 创作。',
    sources: '诗词出处与创作说明',
    sourceNote: '古典原文属公有领域。《望海潮》写杭州，在此借景抒情，并非汴京实录。孔明灯升空为艺术化场景。',
    source1: '柳永 · 北宋《望海潮》',
    footerEdition: '夜游手卷 · 第一卷',
    fallback: '当前以静态画卷呈现，诗词与夜游导航仍可完整使用。',
    bridgeAlt: '琥珀灯火照亮木虹桥，倒影落入墨蓝汴河',
    pavilionAlt: '临水木亭里的茶盏与书卷',
    selected: '已选为灯笺',
    observations: [
      '水初沸，茶正香。楼上临窗的位置，还为你留着。',
      '绢帛在灯下泛起柔光，风把一寸春色送过长街。',
      '船桨划开碎金，货船把一城的明日，泊进今夜。'
    ],
    finaleKicker: '卷末 · 人间长卷',
    replayCity: '重现一城',
    cityMotto: '一城风物，生生不息。',
    cityCaption: '市井有声 · 河山有序',
    toDay: '切换为白昼',
    toNight: '切换为夜色',
    day: '白昼',
    night: '夜色',
    ticket: '落笔成灯 · 你的心意',
    ticketFoot: '一字一光，随水远行',
    riverRelease: '放一盏河灯',
    riverDone: '灯笺已入河，愿心意随水远行。',
    festivalTitle: '汴河好戏 · 点一场人间烟火',
    iron: '打铁花',
    fireworks: '看烟花',
    voice: '听一声叫卖',
    marketCry: '“新沏的茶——来歇歇脚嘞。”',
    ironDone: '铁花散作金雨，落在汴河的晚风里。',
    fireworksDone: '抬头，烟花正开在屋檐之上。',
    quietShow: '已选择这场好戏。减少动态模式下保留静态灯会。',
    noVoice: '这台设备暂不支持语音。新沏的茶——来歇歇脚嘞。'
  };

  const dayCopy = {
    heroKicker: '一卷宋韵 · 一日汴京',
    copy1: '桥上，是初醒的市声。<br>桥下，是流动的春光。<br>南来北往，都在此刻相逢。',
    copy2: '茶香穿过绸帘，笑语漫过屋檐。<br>日光落在青瓦上，市声渐满长街。<br>此刻的繁华，都是寻常。',
    copy3: '暂借一方亭。<br>把市声留在远岸，<br>把一阕词，留给自己。',
    copy4: '一河春色，满城风华。<br>愿这盏灯，把心意送向远方。',
    tag3: '把时光读慢',
    tag4: '让心意远行',
    card1: '虹桥 · 春光中的水与城',
    card2: '一盏茶的时间，让春光停一停。',
    vertical1: '一桥飞架 · 两岸春明',
    vertical2: '一街市声 · 万家寻常',
    scrollNote: '一河 · 五章 · 满城风华',
    footerEdition: '汴京手卷 · 昼夜篇'
  };

  const poems = [
    {
      source: 'source0',
      lines: ['东风夜放花千树，', '更吹落、星如雨。', '宝马雕车香满路，', '凤箫声动，玉壶光转，', '一夜鱼龙舞。'],
      context: '《青玉案·元夕》上阕节选，写元夕灯彩与游人。这里借其灯夜意境，并非汴京夜景的历史记录。'
    },
    {
      source: 'source1',
      lines: ['烟柳画桥，', '风帘翠幕，', '参差十万人家。', '市列珠玑，户盈罗绮，', '竞豪奢。'],
      context: '《望海潮》上阕节选。原词写杭州，借其画桥与市井意象呼应宋代繁华，不将它当作汴京实录。'
    }
  ];

  let theme = 'night';
  try { theme = localStorage.getItem('biandeng-theme') === 'day' ? 'day' : 'night'; } catch (e) {}
  let poemIndex = 0;
  let selectedPoem = 0;
  let selectedLine = 0;
  let observation = 0;
  let releaseCount = 0;
  let releaseBusy = false;
  let active = 0;

  const mediaReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const forceReduce = new URLSearchParams(location.search).get('motion') === 'reduce';
  const reduce = {
    get matches() { return forceReduce || mediaReduce.matches; },
    addEventListener: (type, fn) => mediaReduce.addEventListener(type, fn)
  };
  if (forceReduce) document.documentElement.classList.add('force-reduced');
  window.BIANDENG = { progress: 0, active: 0, reduced: reduce.matches, language: 'zh', theme };
  if (!reduce.matches) document.documentElement.classList.add('js-motion');

  const chapters = $$('.chapter');
  const ids = chapters.map((x) => x.id);
  let starts = [];

  function measure() {
    starts = chapters.map((x) => x.offsetTop);
  }

  // 诗笺只保留原文，点选后写入灯笺
  function renderPoem() {
    const poem = poems[poemIndex];
    $('#poem-source').textContent = copy[poem.source];
    $('#poem-context').textContent = poem.context;
    $('#poem-lines').replaceChildren(...poem.lines.map((line, i) => {
      const button = document.createElement('button');
      button.className = 'poem-line';
      button.dataset.line = i;
      button.setAttribute('aria-pressed', String(selectedPoem === poemIndex && selectedLine === i));
      const text = document.createElement('span');
      text.className = 'original';
      text.lang = 'zh-CN';
      text.textContent = line;
      button.append(text);
      button.addEventListener('click', () => {
        selectedPoem = poemIndex;
        selectedLine = i;
        $$('.poem-line').forEach((item, j) => item.setAttribute('aria-pressed', String(j === i)));
        updateSelection();
        $('#selection-label').textContent = copy.selected + ' · ' + copy.carry;
      });
      return button;
    }));
    $$('[data-poem]').forEach((button) => button.setAttribute('aria-pressed', String(+button.dataset.poem === poemIndex)));
  }

  function updateSelection() {
    const line = poems[selectedPoem].lines[selectedLine];
    $('#selected-verse').textContent = line;
    $('#ticket-verse').textContent = line;
    const ticket = $('.verse-ticket');
    ticket.classList.remove('inscribed');
    void ticket.offsetWidth;
    ticket.classList.add('inscribed');
    const translation = $('#selected-translation');
    if (translation) translation.textContent = '';
  }

  function applyCopy() {
    document.documentElement.lang = 'zh-CN';
    document.title = theme === 'day' ? '汴灯 — 一河春色，满城风华' : copy.title;
    $('meta[name=description]').content = copy.description;
    $$('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const value = theme === 'day' && dayCopy[key] != null ? dayCopy[key] : copy[key];
      el.innerHTML = value ?? '';
    });
    $$('[data-label]').forEach((el) => el.setAttribute('aria-label', copy[el.dataset.label]));
    $$('[data-alt]').forEach((el) => { el.alt = copy[el.dataset.alt]; });
    $$('[data-heading]').forEach((el) => {
      let n = 0;
      el.innerHTML = copy[el.dataset.heading].split('|').map((row) => {
        const word = document.createElement('span');
        word.className = 'word';
        word.style.setProperty('--i', n++);
        word.textContent = row;
        return word.outerHTML;
      }).join('<br>');
    });
    $('.brand').setAttribute('aria-label', copy.title);
    $('.menu-toggle').setAttribute('aria-label', copy[$('.menu-toggle').getAttribute('aria-expanded') === 'true' ? 'closeMenu' : 'openMenu']);
  }

  // 昼夜切换：文案、插画和场景灯光一起换
  function updateThemeUI() {
    document.documentElement.dataset.theme = theme;
    window.BIANDENG.theme = theme;
    applyCopy();
    $('#theme-label').textContent = theme === 'night' ? copy.day : copy.night;
    $('#theme-toggle').setAttribute('aria-label', theme === 'night' ? copy.toDay : copy.toNight);
    $('#theme-toggle').setAttribute('aria-pressed', String(theme === 'day'));
    $('.theme-icon').textContent = theme === 'night' ? '☀' : '☾';
    if (theme === 'day') {
      $('.hero-copy').innerHTML = '沿一河春色，入一日汴京。<br>看桥市初醒，听千家万户的寻常。';
      $('[data-i18n="nightLabel"]').textContent = '汴河晴光';
      $('.hero-subtitle').innerHTML = '汴京<br><span>晴光</span>';
      $('.hero .vertical-note>span').textContent = '一河春色 · 满城风华';
      $('img[data-alt="bridgeAlt"]').alt = '金色日光照亮虹桥与繁忙河岸';
    } else {
      $('.hero-copy').innerHTML = copy.heroCopy;
      $('[data-i18n="nightLabel"]').textContent = copy.nightLabel;
      $('.hero-subtitle').innerHTML = '汴京<br><span>夜色</span>';
      $('.hero .vertical-note>span').textContent = copy.vertical0;
      $('img[data-alt="bridgeAlt"]').alt = copy.bridgeAlt;
    }
    $('.hero .vertical-note small').textContent = theme === 'day' ? '汴京 · 昼' : '汴京 · 夜';
    document.querySelectorAll('img[data-alt]').forEach((img) => {
      if (!img.dataset.nightSrc) {
        img.dataset.nightSrc = img.getAttribute('src');
        img.dataset.daySrc = img.dataset.alt === 'bridgeAlt' ? 'assets/bridge-day.webp' : 'assets/pavilion-day.webp';
      }
      img.src = theme === 'day' ? img.dataset.daySrc : img.dataset.nightSrc;
    });
    renderPoem();
    updateSelection();
    $('#observation').textContent = copy.observations[observation];
    if (releaseBusy) $('#release span').textContent = copy.releasing;
    else if (releaseCount) {
      $('#release span').textContent = copy.releaseAgain;
      $('#release-status').textContent = copy.released;
    }
  }

  $('#theme-toggle').addEventListener('click', () => {
    theme = theme === 'day' ? 'night' : 'day';
    updateThemeUI();
    try { localStorage.setItem('biandeng-theme', theme); } catch (e) {}
    window.dispatchEvent(new CustomEvent('biandeng-theme', { detail: { theme } }));
  });

  $('#replay-city').addEventListener('click', () => {
    document.querySelector('.footer-city-stage').scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth', block: 'center' });
    window.dispatchEvent(new Event('replay-city'));
  });

  $$('[data-poem]').forEach((button) => button.addEventListener('click', () => {
    poemIndex = +button.dataset.poem;
    renderPoem();
  }));
  $$('[data-observation]').forEach((button) => button.addEventListener('click', () => {
    observation = +button.dataset.observation;
    $('#observation').textContent = copy.observations[observation];
    $$('[data-observation]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  }));

  $('#discover').addEventListener('click', () => {
    const poem = $('#discovered-poem');
    poem.hidden = !poem.hidden;
    $('#discover').setAttribute('aria-expanded', String(!poem.hidden));
    measure();
  });

  function menu(open, focus = true) {
    $('#mobile-menu').hidden = !open;
    $('.menu-toggle').setAttribute('aria-expanded', String(open));
    $('.menu-toggle').setAttribute('aria-label', copy[open ? 'closeMenu' : 'openMenu']);
    document.body.classList.toggle('menu-open', open);
    for (const el of [$('#journey'), $('#manifesto'), $('.chapter-rail')]) el.inert = open;
    if (focus) {
      if (open) $('#mobile-menu a').focus();
      else $('.menu-toggle').focus();
    }
  }
  $('.menu-toggle').addEventListener('click', () => menu($('#mobile-menu').hidden));
  document.addEventListener('keydown', (event) => {
    if ($('#mobile-menu').hidden) return;
    if (event.key === 'Escape') { menu(false); return; }
    if (event.key === 'Tab') {
      const nodes = [$('.menu-toggle'), ...$$('#mobile-menu a')];
      const first = nodes[0];
      const last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  $$('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const wasOpen = !$('#mobile-menu').hidden;
    menu(false, false);
    history.pushState(null, '', link.getAttribute('href'));
    target.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth', block: 'start' });
    if (wasOpen) {
      const heading = target.querySelector('h1,h2') || target;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }));

  function updateProgress() {
    const y = scrollY;
    let index = 0;
    for (let j = 0; j < starts.length; j++) if (y >= starts[j] - innerHeight * 0.32) index = j;
    if (index !== active || !document.body.dataset.chapter) {
      active = index;
      document.body.dataset.chapter = index;
      window.BIANDENG.active = index;
      $$('.chapter-rail a,.desktop-nav a').forEach((link) => {
        if (link.hash === '#' + ids[index]) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    }
    let segment = 0;
    for (let j = 0; j < starts.length; j++) if (y >= starts[j]) segment = j;
    const progress = segment < 4
      ? segment + Math.max(0, Math.min(1, (y - starts[segment]) / (starts[segment + 1] - starts[segment])))
      : 4;
    window.BIANDENG.progress = progress;
    $('.bottom-progress span').style.width = Math.min(100, y / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
  }

  let scheduled = false;
  addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => { updateProgress(); scheduled = false; });
    }
  }, { passive: true });
  addEventListener('resize', () => {
    if (innerWidth > 700 && !$('#mobile-menu').hidden) menu(false, false);
    measure();
    updateProgress();
  });
  new ResizeObserver(() => { measure(); updateProgress(); }).observe($('#journey'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = ((i % 4) * 75) + 'ms';
    revealObserver.observe(el);
  });

  $('#release').addEventListener('click', () => {
    if (releaseBusy) return;
    releaseBusy = true;
    releaseCount++;
    $('#release').disabled = true;
    $('#release span').textContent = copy.releasing;
    window.dispatchEvent(new CustomEvent('release-lantern', { detail: { verse: poems[selectedPoem].lines[selectedLine] } }));
    $('#release-status').textContent = copy.released;
    setTimeout(() => {
      releaseBusy = false;
      $('#release').disabled = false;
      $('#release span').textContent = copy.releaseAgain;
    }, reduce.matches ? 400 : 3000);
  });

  const cursor = $('#cursor');
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reduce.matches) return;
    cursor.classList.add('active');
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    cursor.classList.toggle('hover', !!event.target.closest('a,button,summary'));
  }, { passive: true });
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) cursor.classList.remove('active');
  });
  reduce.addEventListener('change', () => {
    window.BIANDENG.reduced = reduce.matches;
    document.documentElement.classList.toggle('js-motion', !reduce.matches);
  });

  $('#release-river').addEventListener('click', () => {
    const button = $('#release-river');
    button.disabled = true;
    window.dispatchEvent(new CustomEvent('release-river', { detail: { verse: poems[selectedPoem].lines[selectedLine] } }));
    $('#release-status').textContent = copy.riverDone;
    button.dataset.releases = String(+(button.dataset.releases || 0) + 1);
    setTimeout(() => { button.disabled = false; }, reduce.matches ? 400 : 1600);
  });

  $$('[data-show]').forEach((button) => button.addEventListener('click', () => {
    const kind = button.dataset.show;
    window.dispatchEvent(new CustomEvent('festival-show', { detail: { kind } }));
    $('#festival-status').textContent = copy[reduce.matches ? 'quietShow' : kind === 'iron' ? 'ironDone' : 'fireworksDone'];
    button.disabled = true;
    setTimeout(() => { button.disabled = false; }, 1800);
  }));

  $('#market-voice').addEventListener('click', () => {
    const text = copy.marketCry;
    $('#festival-status').textContent = text;
    if (!('speechSynthesis' in window)) {
      $('#festival-status').textContent = copy.noVoice;
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.88;
    const button = $('#market-voice');
    button.setAttribute('aria-pressed', 'true');
    utterance.onend = () => button.setAttribute('aria-pressed', 'false');
    utterance.onerror = () => {
      button.setAttribute('aria-pressed', 'false');
      $('#festival-status').textContent = copy.noVoice;
    };
    speechSynthesis.speak(utterance);
  });

  updateThemeUI();
  requestAnimationFrame(() => {
    measure();
    if (location.hash) {
      const target = $(location.hash);
      if (target) target.scrollIntoView({ behavior: 'instant' });
    }
    updateProgress();
  });
  window.addEventListener('load', () => { measure(); updateProgress(); });

  window.BIANDENG.getState = () => ({
    language: 'zh',
    chapter: active,
    progress: window.BIANDENG.progress,
    poem: poemIndex,
    selectedPoem,
    selectedLine,
    releaseCount,
    theme,
    reduced: reduce.matches
  });
})();
