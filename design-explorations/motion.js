/* ==========================================================================
   "In Motion" — scroll reveals, hero entrance, stat count-ups, parallax.
   Progressive enhancement, selector-driven (no HTML edits needed).
   Honours prefers-reduced-motion, but a preview-only "Play motion" button
   can force the effects on so they can be evaluated regardless.
   ========================================================================== */
(function () {
  'use strict';
  var mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  var revealSelectors = [
    '.s-eyebrow', '.s-title', '.s-intro',
    '.problem-card', '.sov-card', '.session-card', '.career-card', '.further-card',
    '.outcome-row', '.trust-stat', '.alp-panel', '.ai-feature',
    '.about-text', '.about-mark', '.mini-q', '.pull-quote', '.pull-cite',
    '.wb-pillar', '.practice-item', '.session-row'
  ];

  var revealIO = null;
  var parallaxBound = false;

  /* ---- 1. Reveal on scroll (re-runnable) ---- */
  function setupReveals() {
    var els = Array.prototype.slice.call(
      document.querySelectorAll(revealSelectors.join(','))
    );
    if (!els.length) return;
    els.forEach(function (el) {
      el.setAttribute('data-reveal', '');
      el.classList.remove('is-visible');   // reset so a replay re-animates
    });
    var groups = document.querySelectorAll(
      '.problem-grid, .services-overview-grid, .sessions-grid, .career-grid, ' +
      '.further-grid, .mini-quotes, .wellbeing-grid, .practice-grid, ' +
      '.outcomes-table, .sessions-detail, .trust-bar-inner'
    );
    Array.prototype.forEach.call(groups, function (grid) {
      var i = 0;
      Array.prototype.forEach.call(grid.children, function (child) {
        if (child.hasAttribute && child.hasAttribute('data-reveal')) {
          child.style.transitionDelay = (i * 80) + 'ms';
          i++;
        }
      });
    });
    if (revealIO) revealIO.disconnect();
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---- 2. Stat count-up ---- */
  function animateNum(el) {
    var m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
    if (!m) return;
    var raw = m[1], suffix = m[2], target = parseFloat(raw);
    var decimals = (raw.split('.')[1] || '').length, dur = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = raw + suffix;
    }
    requestAnimationFrame(step);
  }
  function setupCountUp() {
    var nums = document.querySelectorAll('.trust-num');
    if (!nums.length) return;
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateNum(e.target); nio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(nums, function (n) { nio.observe(n); });
  }

  /* ---- 3. Hero entrance ---- */
  function setupHero() {
    var hero = document.querySelector('.hero-a, .page-hero');
    if (!hero) return;
    var order = [
      '.hero-a-logo', '.hero-a-eyebrow', '.hero-a-title', '.hero-a-sub', '.hero-a-actions',
      '.page-hero-eyebrow', '.page-hero-title', '.page-hero-sub'
    ];
    var heroEls = [];
    order.forEach(function (sel) { var el = hero.querySelector(sel); if (el) heroEls.push(el); });
    heroEls.forEach(function (el, i) {
      el.classList.add('motion-hero-el');
      el.classList.remove('is-in');
      el.style.transitionDelay = (i * 110) + 'ms';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroEls.forEach(function (el) { el.classList.add('is-in'); });
      });
    });
  }

  /* ---- 4. Gentle parallax (bind once) ---- */
  function setupParallax() {
    if (parallaxBound) return;
    var band = document.querySelectorAll('.ai-feature img');
    var mark = document.querySelectorAll('.about-mark img');
    if (!band.length && !mark.length) return;
    parallaxBound = true;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        Array.prototype.forEach.call(band, function (img) {
          var r = img.getBoundingClientRect();
          var off = ((r.top + r.height / 2) - vh / 2) / vh;
          var y = Math.max(-16, Math.min(16, -off * 28));
          img.style.transform = 'translate3d(0,' + y + 'px,0) scale(1.08)';
        });
        Array.prototype.forEach.call(mark, function (img) {
          var r = img.getBoundingClientRect();
          var off = ((r.top + r.height / 2) - vh / 2) / vh;
          var y = Math.max(-10, Math.min(10, -off * 20));
          img.style.transform = 'translate3d(0,' + y + 'px,0)';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function runAll() {
    if (!hasIO) return;
    setupReveals();
    setupCountUp();
    setupHero();
    setupParallax();
  }

  /* ---- Preview-only "Play motion" button ---- */
  function addToggle() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '▶ Play motion';
    btn.style.cssText = [
      'position:fixed', 'left:16px', 'bottom:16px', 'z-index:10000',
      'font-family:var(--font-sans)', 'font-size:0.8rem', 'font-weight:500',
      'color:#fff', 'background:var(--teal)', 'border:none', 'cursor:pointer',
      'padding:0.55rem 1.05rem', 'border-radius:100px',
      'box-shadow:0 6px 20px rgba(0,0,0,0.28)'
    ].join(';');
    btn.addEventListener('click', function () {
      document.body.classList.add('force-motion'); // overrides reduced-motion guard in CSS
      window.scrollTo({ top: 0, behavior: 'auto' });
      // let the scroll settle, then replay
      requestAnimationFrame(function () { runAll(); });
    });
    document.body.appendChild(btn);
  }

  /* ---- init ---- */
  if (!mql.matches) { runAll(); }   // auto-play when motion is allowed
  addToggle();                       // always available (esp. if Reduce Motion is on)
})();
