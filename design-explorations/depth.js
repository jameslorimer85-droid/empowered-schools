/* ==========================================================================
   "Depth & Atmosphere" — light scroll reveals + stat count-up.
   Visual depth is handled in depth.css; motion here is secondary.
   Honours prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  if (reduce || !hasIO) return;

  /* ---- Light reveal on scroll ---- */
  var sel = [
    '.s-eyebrow', '.s-title', '.s-intro',
    '.problem-card', '.sov-card', '.session-card', '.career-card', '.further-card',
    '.outcome-row', '.alp-panel', '.ai-feature', '.about-text', '.about-mark',
    '.mini-q', '.pull-quote', '.wb-pillar', '.practice-item', '.session-row'
  ];
  var els = Array.prototype.slice.call(document.querySelectorAll(sel.join(',')));
  if (els.length) {
    els.forEach(function (el) { el.setAttribute('data-reveal', ''); });
    var groups = document.querySelectorAll(
      '.problem-grid, .services-overview-grid, .career-grid, .further-grid, ' +
      '.mini-quotes, .wellbeing-grid, .practice-grid, .outcomes-table, .sessions-detail'
    );
    Array.prototype.forEach.call(groups, function (grid) {
      var i = 0;
      Array.prototype.forEach.call(grid.children, function (child) {
        if (child.hasAttribute && child.hasAttribute('data-reveal')) {
          child.style.transitionDelay = (i * 70) + 'ms';
          i++;
        }
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Stat count-up ---- */
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
  var nums = document.querySelectorAll('.trust-num');
  if (nums.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateNum(e.target); nio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(nums, function (n) { nio.observe(n); });
  }
})();
