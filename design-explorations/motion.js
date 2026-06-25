/* ==========================================================================
   "In Motion" — scroll reveals, hero entrance, stat count-ups, parallax.
   Pure progressive enhancement, selector-driven (no HTML edits needed).
   Honours prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---- 1. Reveal on scroll ---- */
  var revealSelectors = [
    '.s-eyebrow', '.s-title', '.s-intro',
    '.problem-card', '.sov-card', '.session-card', '.career-card', '.further-card',
    '.outcome-row', '.trust-stat', '.alp-panel', '.ai-feature',
    '.about-text', '.about-mark', '.mini-q', '.pull-quote', '.pull-cite',
    '.wb-pillar', '.practice-item', '.session-row'
  ];
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll(revealSelectors.join(','))
  );

  if (!reduce && hasIO && revealEls.length) {
    revealEls.forEach(function (el) { el.setAttribute('data-reveal', ''); });

    /* stagger items within a grid/row group */
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

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- 2. Stat count-up ---- */
  function animateNum(el) {
    var text = el.textContent.trim();
    var m = text.match(/^([\d.]+)(.*)$/);
    if (!m) return;
    var raw = m[1], suffix = m[2];
    var target = parseFloat(raw);
    var decimals = (raw.split('.')[1] || '').length;
    var dur = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) { requestAnimationFrame(step); }
      else { el.textContent = raw + suffix; }
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll('.trust-num');
  if (!reduce && hasIO && nums.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateNum(e.target); nio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(nums, function (n) { nio.observe(n); });
  }

  /* ---- 3. Hero entrance ---- */
  if (!reduce) {
    var hero = document.querySelector('.hero-a, .page-hero');
    if (hero) {
      var order = [
        '.hero-a-logo', '.hero-a-eyebrow', '.hero-a-title', '.hero-a-sub', '.hero-a-actions',
        '.page-hero-eyebrow', '.page-hero-title', '.page-hero-sub'
      ];
      var heroEls = [];
      order.forEach(function (sel) {
        var el = hero.querySelector(sel);
        if (el) heroEls.push(el);
      });
      heroEls.forEach(function (el, i) {
        el.classList.add('motion-hero-el');
        el.style.transitionDelay = (i * 110) + 'ms';
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroEls.forEach(function (el) { el.classList.add('is-in'); });
        });
      });
    }
  }

  /* ---- 4. Gentle parallax ---- */
  if (!reduce) {
    var band = document.querySelectorAll('.ai-feature img');   // scaled 1.08 in CSS
    var mark = document.querySelectorAll('.about-mark img');
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        Array.prototype.forEach.call(band, function (img) {
          var r = img.getBoundingClientRect();
          var off = ((r.top + r.height / 2) - vh / 2) / vh; // ~ -0.5..0.5
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
    if (band.length || mark.length) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();
    }
  }
})();
