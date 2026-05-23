/* ============================================================
   AAKASH YADAV PORTFOLIO — script.js
   Analytics & Automation Systems Engineer
   ============================================================ */

'use strict';

/* ─── UTILITIES ──────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t)    => a + (b - a) * t;

/* ─── SCROLL PROGRESS BAR ────────────────────────────────── */
function initScrollProgress() {
  const bar = $('#scrollProgressBar');
  if (!bar) return;
  const update = () => {
    const s  = document.documentElement.scrollTop;
    const h  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.round((s / h) * 100) : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', pct);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function initNavbar() {
  const nav    = $('#navbar');
  const ham    = $('#hamburger');
  const menu   = $('#mobileMenu');
  const links  = $$('.nav-link');
  const mLinks = $$('.mobile-nav-link');

  if (!nav) return;

  /* Scroll state */
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active section highlight */
  const sections = $$('section[id]');
  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(s => {
      if (scrollY >= s.offsetTop) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.dataset.nav === current);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* Hamburger toggle */
  const toggleMenu = open => {
    const isOpen = open ?? menu.classList.contains('open');
    const next   = !isOpen;
    menu.classList.toggle('open', next);
    menu.setAttribute('aria-hidden', String(!next));
    ham.setAttribute('aria-expanded', String(next));
    document.body.style.overflow = next ? 'hidden' : '';
  };

  ham.addEventListener('click', () => toggleMenu());

  mLinks.forEach(l => {
    l.addEventListener('click', () => toggleMenu(true));
  });

  /* Close on ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

/* ─── REVEAL ON SCROLL ───────────────────────────────────── */
function initReveal() {
  const items = $$('.reveal-up');
  if (!items.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => io.observe(el));
}

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function initCounters() {
  const targets = [80, 30, 25, 85];
  const ids     = ['cnt0', 'cnt1', 'cnt2', 'cnt3'];
  const duration = 1800;

  const animate = (el, target) => {
    const start = performance.now();
    const tick  = now => {
      const progress = clamp((now - start) / duration, 0, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(lerp(0, target, ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = ids.indexOf(e.target.id);
        if (idx !== -1) animate(e.target, targets[idx]);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.4 }
  );

  ids.forEach(id => {
    const el = $('#' + id);
    if (el) io.observe(el);
  });
}

/* ─── FOOTER YEAR ────────────────────────────────────────── */
function initFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── OPERATIONAL INTELLIGENCE SIMULATOR ────────────────── */
function initSimulator() {
  const canvas    = $('#simCanvas');
  const logBody   = $('#simLogBody');
  const kpiThr    = $('#kpiThroughput');
  const kpiPip    = $('#kpiPipeline');
  const kpiAcc    = $('#kpiAccuracy');
  const liveDot   = $('#simLiveDot');
  const liveLabel = $('#simLiveLabel');

  if (!canvas || !logBody) return;

  const ctx = canvas.getContext('2d');

  /* ── Sizing ── */
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  const canvasW = () => canvas.getBoundingClientRect().width;
  const canvasH = () => canvas.getBoundingClientRect().height;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  /* ── Color helpers (read CSS vars) ── */
  const C = {
    bg:       getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim()      || '#080c12',
    bgRaised: getComputedStyle(document.documentElement).getPropertyValue('--bg-raised').trim()    || '#111827',
    border:   getComputedStyle(document.documentElement).getPropertyValue('--bg-border').trim()    || '#1c2a3a',
    cyan:     getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim()         || '#00d4ff',
    amber:    getComputedStyle(document.documentElement).getPropertyValue('--amber').trim()        || '#f59e0b',
    emerald:  getComputedStyle(document.documentElement).getPropertyValue('--emerald').trim()      || '#10b981',
    red:      getComputedStyle(document.documentElement).getPropertyValue('--red').trim()          || '#ef4444',
    violet:   getComputedStyle(document.documentElement).getPropertyValue('--violet').trim()       || '#8b5cf6',
    textMono: getComputedStyle(document.documentElement).getPropertyValue('--text-mono').trim()    || '#5eaed4',
    textMuted:getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()   || '#4d6681',
  };

  /* ── Pipeline nodes ── */
  const NODES = [
    { id: 'ingest',   label: 'DATA\nINGEST',   icon: '⬇',  x: 0.1,  y: 0.5 },
    { id: 'validate', label: 'VALIDATE',        icon: '✓',  x: 0.3,  y: 0.5 },
    { id: 'process',  label: 'PROCESS',         icon: '⚙',  x: 0.5,  y: 0.5 },
    { id: 'automate', label: 'AUTOMATE',        icon: '→',  x: 0.7,  y: 0.5 },
    { id: 'output',   label: 'KPI\nOUTPUT',     icon: '📊', x: 0.9,  y: 0.5 },
  ];

  const EDGES = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
  ];

  /* ── Sim state ── */
  let simState = {
    mode: 'normal',   // 'normal' | 'anomaly' | 'resolving'
    tick: 0,
    throughput: 98.4,
    accuracy:   99.2,
    pipeline:   'ACTIVE',
    anomalyNode: -1,
    particles:  [],
    nodeStatus: NODES.map(() => 'ok'), // 'ok' | 'warn' | 'error' | 'resolving'
    sparkData:  Array.from({ length: 40 }, (_, i) => 95 + Math.random() * 4),
  };

  /* ── Particles (data flow dots) ── */
  function spawnParticle(fromIdx) {
    const toIdx = fromIdx + 1;
    if (toIdx >= NODES.length) return;
    simState.particles.push({
      fromIdx, toIdx,
      progress: 0,
      speed: 0.012 + Math.random() * 0.008,
      color: simState.mode === 'anomaly' ? C.amber : C.cyan,
    });
  }

  /* ── Log messages ── */
  const LOG_NORMAL = [
    { text: 'Pipeline nominal — all nodes healthy', color: C.cyan },
    { text: 'Data ingestion complete — 1,247 records', color: C.textMono },
    { text: 'Validation pass — schema integrity confirmed', color: C.emerald },
    { text: 'Processing batch — applying transformation rules', color: C.textMono },
    { text: 'Automation layer engaged — report triggered', color: C.cyan },
    { text: 'KPI output refreshed — dashboard updated', color: C.emerald },
    { text: 'Workflow cycle complete — 0 errors', color: C.emerald },
    { text: 'Monitoring active — throughput: 98.4%', color: C.textMono },
  ];

  const LOG_ANOMALY = [
    { text: '⚠  Anomaly detected — metric spike in VALIDATE node', color: C.amber },
    { text: '⚠  Data consistency flag raised — root-cause analysis triggered', color: C.amber },
    { text: '⚠  Validation failure: 3 records failed schema check', color: C.red },
    { text: '⚠  Throughput degraded — pipeline rerouting...', color: C.amber },
  ];

  const LOG_RESOLVE = [
    { text: '✓  Root-cause identified — null field in source data', color: C.cyan },
    { text: '✓  Validation rules patched — re-processing batch', color: C.cyan },
    { text: '✓  Pipeline rerouted — flow restored', color: C.emerald },
    { text: '✓  All nodes healthy — automation resumed', color: C.emerald },
    { text: '✓  KPI accuracy restored — 99.2%', color: C.emerald },
  ];

  let logQueue = [];
  let logTimer = 0;

  function pushLog(entry) {
    logQueue.push(entry);
  }

  function flushLog() {
    if (!logQueue.length) return;
    const entry = logQueue.shift();
    const line  = document.createElement('div');
    line.style.cssText = `
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.05em;
      color: ${entry.color};
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 300ms, transform 300ms;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    line.textContent = '> ' + entry.text;

    /* Keep max 5 lines */
    while (logBody.children.length >= 5) {
      logBody.removeChild(logBody.firstChild);
    }
    logBody.appendChild(line);
    requestAnimationFrame(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    });
  }

  /* ── Update KPI displays ── */
  function updateKPIs() {
    if (kpiThr)   kpiThr.textContent = simState.throughput.toFixed(1) + '%';
    if (kpiAcc)   kpiAcc.textContent = simState.accuracy.toFixed(1) + '%';
    if (kpiPip) {
      kpiPip.textContent = simState.pipeline;
      kpiPip.style.color = simState.pipeline === 'ACTIVE'  ? C.cyan   :
                           simState.pipeline === 'WARNING' ? C.amber  : C.red;
    }
  }

  /* ── Sim logic tick ── */
  let anomalyCooldown = 0;

  function simTick() {
    simState.tick++;

    /* Update sparkline data */
    const jitter = simState.mode === 'anomaly' ? -2 + Math.random() * 4 : Math.random() * 1.5 - 0.5;
    simState.sparkData.push(clamp(simState.sparkData[simState.sparkData.length - 1] + jitter, 90, 100));
    if (simState.sparkData.length > 50) simState.sparkData.shift();

    /* Spawn particles */
    if (simState.tick % 28 === 0) spawnParticle(0);
    if (simState.tick % 35 === 0) spawnParticle(1);
    if (simState.tick % 42 === 0) spawnParticle(2);
    if (simState.tick % 50 === 0) spawnParticle(3);

    /* Anomaly logic */
    anomalyCooldown = Math.max(0, anomalyCooldown - 1);

    if (simState.mode === 'normal' && anomalyCooldown === 0 && simState.tick % 220 === 0) {
      /* Trigger anomaly */
      simState.mode       = 'anomaly';
      simState.anomalyNode = 1 + Math.floor(Math.random() * 3);
      simState.nodeStatus[simState.anomalyNode] = 'error';
      simState.throughput = 72 + Math.random() * 8;
      simState.accuracy   = 91 + Math.random() * 3;
      simState.pipeline   = 'WARNING';

      if (liveDot)   liveDot.style.background = C.amber;
      if (liveLabel) liveLabel.textContent     = 'ALERT';

      LOG_ANOMALY.forEach((l, i) => setTimeout(() => pushLog(l), i * 600));
      updateKPIs();

      /* Auto-resolve after 4s */
      setTimeout(() => {
        simState.mode = 'resolving';
        simState.nodeStatus[simState.anomalyNode] = 'resolving';
        LOG_RESOLVE.forEach((l, i) => setTimeout(() => pushLog(l), i * 500));

        setTimeout(() => {
          simState.mode = 'normal';
          simState.nodeStatus = NODES.map(() => 'ok');
          simState.throughput = 97 + Math.random() * 2;
          simState.accuracy   = 99 + Math.random() * 0.5;
          simState.pipeline   = 'ACTIVE';
          if (liveDot)   liveDot.style.background = C.emerald;
          if (liveLabel) liveLabel.textContent     = 'LIVE';
          anomalyCooldown = 180;
          updateKPIs();
        }, 3000);
      }, 4000);
    }

    /* Flush log periodically */
    logTimer++;
    if (logTimer % 90 === 0 && simState.mode === 'normal') {
      const entry = LOG_NORMAL[Math.floor(Math.random() * LOG_NORMAL.length)];
      pushLog(entry);
    }
    if (logTimer % 30 === 0) flushLog();
  }

  /* ── Draw frame ── */
  function draw() {
    const W = canvasW();
    const H = canvasH();
    if (!W || !H) return;

    ctx.clearRect(0, 0, W, H);

    /* Background */
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Draw sparkline ── */
    const sparkPoints = simState.sparkData;
    const sW = W;
    const sH = H * 0.35;
    const sY = H * 0.1;
    const step = sW / (sparkPoints.length - 1);

    ctx.beginPath();
    ctx.moveTo(0, sY + sH - ((sparkPoints[0] - 88) / 14) * sH);
    sparkPoints.forEach((v, i) => {
      const x = i * step;
      const y = sY + sH - ((v - 88) / 14) * sH;
      ctx.lineTo(x, y);
    });

    /* Gradient fill under sparkline */
    const grad = ctx.createLinearGradient(0, sY, 0, sY + sH);
    grad.addColorStop(0,   simState.mode === 'anomaly' ? 'rgba(245,158,11,0.18)' : 'rgba(0,212,255,0.12)');
    grad.addColorStop(0.7, 'rgba(0,0,0,0)');
    ctx.lineTo(sW, sY + sH);
    ctx.lineTo(0,  sY + sH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    /* Stroke */
    ctx.beginPath();
    ctx.moveTo(0, sY + sH - ((sparkPoints[0] - 88) / 14) * sH);
    sparkPoints.forEach((v, i) => {
      const x = i * step;
      const y = sY + sH - ((v - 88) / 14) * sH;
      ctx.lineTo(x, y);
    });
    ctx.strokeStyle = simState.mode === 'anomaly' ? C.amber : C.cyan;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    /* ── Draw edges ── */
    EDGES.forEach(e => {
      const fromN = NODES[e.from];
      const toN   = NODES[e.to];
      const x1 = fromN.x * W;
      const y1 = fromN.y * H;
      const x2 = toN.x   * W;
      const y2 = toN.y   * H;

      /* Check if this edge involves the anomaly node */
      const isAnomEdge = simState.mode !== 'normal' &&
        (e.from === simState.anomalyNode || e.to === simState.anomalyNode);

      ctx.beginPath();
      ctx.moveTo(x1 + 20, y1);
      ctx.lineTo(x2 - 20, y2);
      ctx.strokeStyle = isAnomEdge
        ? 'rgba(245,158,11,0.4)'
        : 'rgba(0,212,255,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    /* ── Draw nodes ── */
    NODES.forEach((n, i) => {
      const x      = n.x * W;
      const y      = n.y * H;
      const r      = 22;
      const status = simState.nodeStatus[i];

      const col = status === 'error'     ? C.red    :
                  status === 'resolving' ? C.amber  :
                  status === 'warn'      ? C.amber  : C.cyan;

      /* Glow */
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
      glow.addColorStop(0,   col.replace(')', ', 0.15)').replace('rgb', 'rgba'));
      glow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* Circle bg */
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = C.bgRaised;
      ctx.fill();

      /* Border */
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.lineWidth   = status === 'error' ? 2 : 1.5;
      ctx.stroke();

      /* Label */
      ctx.font      = `600 9px 'JetBrains Mono', monospace`;
      ctx.fillStyle = col;
      ctx.textAlign = 'center';
      const lines = n.label.split('\n');
      if (lines.length === 1) {
        ctx.fillText(n.label, x, y + 3);
      } else {
        ctx.fillText(lines[0], x, y - 3);
        ctx.fillText(lines[1], x, y + 8);
      }
    });

    /* ── Draw particles ── */
    simState.particles = simState.particles.filter(p => {
      p.progress += p.speed;
      if (p.progress >= 1) return false;

      const fromN = NODES[p.fromIdx];
      const toN   = NODES[p.toIdx];
      const x = lerp(fromN.x * W + 20, toN.x * W - 20, p.progress);
      const y = lerp(fromN.y * H,      toN.y * H,       p.progress);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      /* Trail */
      ctx.beginPath();
      const tx = lerp(fromN.x * W + 20, toN.x * W - 20, Math.max(0, p.progress - 0.06));
      const ty = lerp(fromN.y * H,      toN.y * H,       Math.max(0, p.progress - 0.06));
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.strokeStyle = p.color.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#', '').length > 7
        ? p.color
        : p.color + '4d';
      ctx.lineWidth = 1;
      ctx.stroke();

      return true;
    });
  }

  /* ── Animation loop ── */
  let lastTime = 0;
  const FPS    = 30;
  const INTERVAL = 1000 / FPS;

  function loop(timestamp) {
    if (timestamp - lastTime >= INTERVAL) {
      simTick();
      draw();
      lastTime = timestamp;
    }
    requestAnimationFrame(loop);
  }

  /* Seed initial log entries */
  pushLog(LOG_NORMAL[0]);
  pushLog(LOG_NORMAL[5]);
  flushLog();
  setTimeout(flushLog, 400);

  updateKPIs();
  requestAnimationFrame(loop);
}

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ─── TOOL PILLS HOVER STAGGER ───────────────────────────── */
function initToolPills() {
  $$('.tool-pill').forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 20}ms`;
  });
}

/* ─── INIT ───────────────────────────────────────────────── */
function init() {
  initScrollProgress();
  initNavbar();
  initReveal();
  initCounters();
  initFooterYear();
  initSmoothScroll();
  initToolPills();

  /* Simulator runs only when hero is in view (performance) */
  const heroObs = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        initSimulator();
        heroObs.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  const hero = $('#home');
  if (hero) heroObs.observe(hero);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
