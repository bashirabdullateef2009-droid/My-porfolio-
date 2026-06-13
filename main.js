/* ══════════════════════════════════════
   AYO PORTFOLIO — main.js
   Fixes: typewriter stays visible,
   audio autoplay on load, draggable pill,
   better mobile hero
══════════════════════════════════════ */

/* ── Canvas Background ─────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, t = 0;
  const mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  }
  function build() {
    const n = Math.max(40, Math.floor((W * H) / 20000));
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.4 + .4, a: Math.random() * .35 + .08,
    }));
  }
  function loop() {
    t += .006;
    ctx.clearRect(0, 0, W, H);
    const cx = W * (.5 + Math.sin(t * .6) * .22);
    const cy = H * (.5 + Math.cos(t * .45) * .18);
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * .55);
    grd.addColorStop(0,  'rgba(99,102,241,.055)');
    grd.addColorStop(.5, 'rgba(45,212,191,.025)');
    grd.addColorStop(1,  'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d  = Math.hypot(dx, dy);
      if (d < 140) { p.x += dx * .0028; p.y += dy * .0028; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.a})`;
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / 100) * .1})`;
          ctx.lineWidth = .5;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize, { passive: true });
  if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  }
  resize(); loop();
})();

/* ── Custom Cursor ─────────────────────────── */
(function initCursor() {
  // Skip on touch devices — no mouse to track
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function tick() {
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    rx += (mx - rx) * .13;       ry += (my - ry) * .13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── Typewriter — text STAYS after typing ──── */
(function initTypewriter() {
  const el = document.getElementById('typeLine');
  if (!el) return;
  const text = 'Hi, My name is Ayoife';

  /* Set full text immediately so element has correct width from the start */
  el.textContent = text;
  /* Visually hide it via colour, not overflow or width */
  el.style.color = 'transparent';
  el.style.borderRight = '3px solid var(--indigo)';
  el.style.display = 'inline';
  el.style.whiteSpace = 'normal';

  let i = 0;
  /* Build a coloured span character by character over the invisible text */
  /* Actually simpler: just type into a visible wrapper letter by letter */
  el.textContent = '';
  el.style.color = '';

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 68 + Math.random() * 35);
    } else {
      /* DONE — keep element, just blink the cursor forever */
      el.classList.add('typed');
      /* el.style.borderRight stays, animation handles blink */
    }
  }
  /* Start after the fade-up animation completes (~1.4s) */
  setTimeout(type, 950);
})();

/* ── Nav ───────────────────────────────────── */
(function initNav() {
  const header   = document.getElementById('siteHeader');
  const links    = document.querySelectorAll('.nav-link');
  const toggle   = document.getElementById('menuToggle');
  const nav      = document.getElementById('siteNav');
  const sections = ['hero', 'about', 'skills', 'contact'];

  window.addEventListener('scroll', () => {
    header.classList.toggle('stuck', window.scrollY > 50);
    let current = '';
    for (const id of sections) {
      const sec = document.getElementById(id);
      if (sec && window.scrollY >= sec.offsetTop - 180) current = id;
    }
    links.forEach(a => a.classList.toggle('active', a.dataset.nav === current));
  }, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }
})();

/* ── Scroll Reveal ─────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const del = parseFloat(el.dataset.delay || 0) * 1000;
      setTimeout(() => {
        el.classList.add('in-view');
        el.querySelectorAll('.stat-fill').forEach(bar => {
          const w = bar.style.width; bar.style.width = '0';
          requestAnimationFrame(() => { bar.style.width = w; });
        });
      }, del);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── Counters ──────────────────────────────── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count), sfx = el.dataset.suffix || '';
      const steps = 90; let cur = 0;
      const inc = end / steps;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.round(cur) + sfx;
        if (cur >= end) clearInterval(timer);
      }, 16);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
})();

/* ── Audio — autoplay on first interaction ─── */
(function initAudio() {
  const audio  = document.getElementById('bgAudio');
  const btn    = document.getElementById('audioBtn');
  const bars   = document.getElementById('eqBars');
  if (!audio || !btn || !bars) return;

  const iPlay  = btn.querySelector('.icon-play');
  const iPause = btn.querySelector('.icon-pause');
  let playing = false;

  function setPlaying(state) {
    playing = state;
    iPlay.style.display  = state ? 'none' : '';
    iPause.style.display = state ? ''     : 'none';
    bars.classList.toggle('paused', !state);
  }

  function doPlay() {
    audio.volume = 0.32;
    return audio.play().then(() => { setPlaying(true); return true; }).catch(() => false);
  }

  /* 1. Try immediate autoplay */
  doPlay().then(ok => {
    if (ok) return;
    /* 2. Autoplay blocked — play on very first user interaction */
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    function unlock(e) {
      /* Don't hijack the audio button click — that has its own handler */
      if (e.target === btn || btn.contains(e.target)) return;
      doPlay().then(ok2 => {
        if (ok2) events.forEach(ev => document.removeEventListener(ev, unlock));
      });
    }
    events.forEach(ev => document.addEventListener(ev, unlock, { passive: true, once: false }));
  });

  /* Manual toggle */
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (playing) { audio.pause(); setPlaying(false); }
    else { doPlay(); }
  });
})();

/* ── Draggable Audio Pill ──────────────────── */
(function initDraggable() {
  const pill   = document.getElementById('audioPill');
  const handle = document.getElementById('audioDragHandle');
  if (!pill || !handle) return;

  let startX, startY, origLeft, origTop, dragging = false;

  /* Convert fixed bottom/right to top/left so we can drag freely */
  function convertToTopLeft() {
    const rect = pill.getBoundingClientRect();
    pill.style.bottom = 'auto';
    pill.style.right  = 'auto';
    pill.style.left   = rect.left + 'px';
    pill.style.top    = rect.top  + 'px';
  }

  function onDown(e) {
    e.preventDefault();
    convertToTopLeft();
    dragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX - parseFloat(pill.style.left);
    startY = clientY - parseFloat(pill.style.top);
    pill.classList.add('dragging');
    document.body.style.userSelect = 'none';
  }

  function onMove(e) {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let newLeft = clientX - startX;
    let newTop  = clientY - startY;
    /* Clamp inside viewport */
    const pw = pill.offsetWidth, ph = pill.offsetHeight;
    newLeft = Math.max(8, Math.min(window.innerWidth  - pw - 8, newLeft));
    newTop  = Math.max(8, Math.min(window.innerHeight - ph - 8, newTop));
    pill.style.left = newLeft + 'px';
    pill.style.top  = newTop  + 'px';
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    pill.classList.remove('dragging');
    document.body.style.userSelect = '';
  }

  /* Mouse */
  handle.addEventListener('mousedown',  onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);

  /* Touch */
  handle.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend',  onUp);
})();
