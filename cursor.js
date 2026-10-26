// Playful cursor (mouse only): a green dot leads, a sky-blue and a light-green dot tumble around it.
// Over anything clickable the green dot swells into a "보기" disc and its friends circle wider.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.textContent =
    'html.has-cursor, html.has-cursor * { cursor: none !important; }' +
    '.cur { position: fixed; left: 0; top: 0; z-index: 9999; border-radius: 50%; pointer-events: none; opacity: 0; transition: opacity .25s ease; will-change: translate; }' +
    '.cur.on { opacity: 1; }' +
    '.cur-lead { display: grid; place-items: center; width: 14px; height: 14px; margin: -7px 0 0 -7px; background: #607829; color: #fff; box-shadow: 0 0 0 1.5px rgba(255,255,255,.85);' +
    '  font-family: "Gowun Dodum", sans-serif; font-size: 9px; letter-spacing: -.02em; transition: opacity .25s ease, width .35s cubic-bezier(.65,0,.25,1), height .35s cubic-bezier(.65,0,.25,1), margin .35s cubic-bezier(.65,0,.25,1); }' +
    '.cur-lead span { opacity: 0; white-space: nowrap; transition: opacity .2s ease; }' +
    '.cur-lead.big { width: 28px; height: 28px; margin: -14px 0 0 -14px; background: rgba(96,120,41,.92); }' +
    '.cur-lead.big span { opacity: 1; transition-delay: .1s; }' +
    '.cur-pal { width: 10px; height: 10px; margin: -5px 0 0 -5px; box-shadow: 0 0 0 1.5px rgba(255,255,255,.85); }';
  document.head.appendChild(css);
  document.documentElement.classList.add('has-cursor');

  function el(cls, html) { var d = document.createElement('div'); d.className = 'cur ' + cls; d.setAttribute('aria-hidden', 'true'); if (html) d.innerHTML = html; document.body.appendChild(d); return d; }
  var lead = el('cur-lead', '<span>보기</span>');
  // each friend orbits at its own pace and wobbles in and out, on a springy leash
  var pals = [
    { el: el('cur-pal'), color: '#5798D7', a: 0, spin: 2.4, r: 20, wob: 1.7, x: -99, y: -99, vx: 0, vy: 0, k: .09, damp: .78 },
    { el: el('cur-pal'), color: '#a6af32', a: Math.PI, spin: -1.8, r: 26, wob: 2.3, x: -99, y: -99, vx: 0, vy: 0, k: .06, damp: .82 }
  ];
  pals.forEach(function (p) { p.el.style.background = p.color; });

  var mx = -99, my = -99, lx = -99, ly = -99, big = false, t0 = performance.now();
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    big = !!(e.target.closest && e.target.closest('a, button'));
    lead.classList.toggle('big', big);
    [lead].concat(pals.map(function (p) { return p.el; })).forEach(function (d) { d.classList.add('on'); });
  });
  document.addEventListener('mouseleave', function () { [lead].concat(pals.map(function (p) { return p.el; })).forEach(function (d) { d.classList.remove('on'); }); });

  (function tick(now) {
    var t = (now - t0) / 1000;
    lx += (mx - lx) * (still ? 1 : .25); ly += (my - ly) * (still ? 1 : .25);
    lead.style.translate = lx + 'px ' + ly + 'px';
    pals.forEach(function (p, i) {
      var r = (big ? p.r + 7 : p.r) + Math.sin(t * p.wob + i) * 6;
      var ang = p.a + t * p.spin;
      var tx = lx + Math.cos(ang) * r, ty = ly + Math.sin(ang) * r;
      if (still) { p.x = tx; p.y = ty; }
      else { p.vx = (p.vx + (tx - p.x) * p.k) * p.damp; p.vy = (p.vy + (ty - p.y) * p.k) * p.damp; p.x += p.vx; p.y += p.vy; }
      p.el.style.translate = p.x + 'px ' + p.y + 'px';
    });
    requestAnimationFrame(tick);
  })(t0);
})();
