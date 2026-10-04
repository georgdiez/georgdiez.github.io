// Drop-in replacement for docs/scripts/graph.js — no TweenLite/EasePack needed.
// Uses #dynamicgraph + #dynamicgraph-canvas. Add data-banner to #dynamicgraph for the slim sub-page banner.
(function () {
  var host = document.getElementById('dynamicgraph');
  var canvas = document.getElementById('dynamicgraph-canvas');
  if (!host || !canvas) return;
  var ctx = canvas.getContext('2d');
  var isBanner = host.hasAttribute('data-banner');
  var w, h, pts, target, goal, lastRest, color, raf, visible = true, pointerInside = false;
  // The highlight rests on an element marked data-graph-anchor (the portrait on the home page),
  // eases towards the mouse while it is over the graph, and glides back when it leaves.
  var anchors = host.querySelectorAll('[data-graph-anchor]');

  function home() {
    var c = canvas.getBoundingClientRect();
    for (var i = 0; i < anchors.length; i++) {
      var r = anchors[i].getBoundingClientRect();
      if (r.width && r.height) return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top };
    }
    return { x: w * (isBanner ? 0.75 : 0.72), y: h * 0.5 };
  }

  function setup() {
    var r = host.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    w = r.width; h = isBanner ? r.height : Math.max(r.height, window.innerHeight);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var mobile = w <= 768;
    color = '127,212,255'; // same soft cyan as the subtitle and links (#7fd4ff)
    var cols = isBanner ? (mobile ? 6 : 14) : (mobile ? 6 : 9);
    // Phones: denser grid (6x9), since only the area around the portrait is shown there
    var rows = isBanner ? Math.max(2, Math.round(h / 70)) : (mobile ? 9 : cols);
    var jitter = 50;
    pts = [];
    for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
      var x = (i + Math.random()) * w / cols, y = (j + Math.random()) * h / rows;
      pts.push({ x: x, y: y, ox: x, oy: y, tx: x, ty: y, j: jitter,
        rad: 2.5 + Math.random() * 2.5 });
    }
    pts.forEach(function (p) {
      p.near = pts.filter(function (q) { return q !== p; })
        .sort(function (a, b) { return d2(a, p, true) - d2(b, p, true); })
        .slice(0, 4);
    });
    if (!target) target = home();
  }

  function d2(a, b, origin) {
    return origin ? Math.pow(a.ox - b.ox, 2) + Math.pow(a.oy - b.oy, 2)
                  : Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    var rest = home();
    // Expose the anchor position so CSS can mask the graph around it (used on mobile)
    if (!lastRest || Math.abs(rest.x - lastRest.x) > 1 || Math.abs(rest.y - lastRest.y) > 1) {
      canvas.style.setProperty('--gx', Math.round(rest.x) + 'px');
      canvas.style.setProperty('--gy', Math.round(rest.y) + 'px');
      // Same position on the host, for the glow behind the portrait (index.css)
      host.style.setProperty('--gx', Math.round(rest.x) + 'px');
      host.style.setProperty('--gy', Math.round(rest.y) + 'px');
      lastRest = rest;
    }
    if (!pointerInside) goal = rest;
    target.x += (goal.x - target.x) * 0.08;
    target.y += (goal.y - target.y) * 0.08;
    // Size of the bright zones around the target. On the hero the target rests on the portrait,
    // which would hide most of the bright zone behind the photo, so the zones are wider there.
    var s = isBanner ? 3 : (w <= 768 ? 0.78 : 1.225); // radius = 70% of the previous 1.6 / 2.5 (0.7² = 0.49)
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (Math.abs(p.x - p.tx) < 1 && Math.abs(p.y - p.ty) < 1) {
        p.tx = p.ox - p.j + Math.random() * 2 * p.j;
        p.ty = p.oy - p.j + Math.random() * 2 * p.j;
      }
      p.x += (p.tx - p.x) * 0.012; p.y += (p.ty - p.y) * 0.012;
      var d = d2(p, target);
      p.a = d < 22000 * s ? 0.55 : d < 90000 * s ? 0.22 : d < 200000 * s ? 0.07 : 0.02;
    }
    ctx.lineWidth = 1.2;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      for (var k = 0; k < p.near.length; k++) {
        var q = p.near[k];
        ctx.strokeStyle = 'rgba(' + color + ',' + Math.min(p.a, q.a) + ')';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      ctx.fillStyle = 'rgba(' + color + ',' + Math.min(1, p.a * 1.6) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop() { frame(); raf = visible ? requestAnimationFrame(loop) : null; }

  if (!('ontouchstart' in window)) {
    host.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      goal = { x: e.clientX - r.left, y: e.clientY - r.top };
      pointerInside = true;
    });
    host.addEventListener('mouseleave', function () { pointerInside = false; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }).observe(host);
  }
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { setup(); frame(); }, 120); });

  setup();
  loop();
})();
