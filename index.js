/* ─────────────────────────────────
   DEVOPS HUB — INDEX.JS
   ───────────────────────────────── */

// ══ THEME TOGGLE ══
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('devops-theme', theme);
}
themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});
// Restore saved theme
const saved = localStorage.getItem('devops-theme');
if (saved) setTheme(saved);


// ══ HAMBURGER MENU ══
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));


// ══ ACTIVE NAV ON SCROLL ══
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
  // Scroll-shrink navbar
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.4)' : 'none';
});


// ══ ANIMATED COUNTER ══
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  const duration = 1600;
  const step = 16;
  const steps = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = isFloat ? current.toFixed(2) : Math.floor(current);
  }, step);
}

// Trigger counters when stats strip enters view
const statsStrip = document.querySelector('.stats-strip');
let countersRan = false;
const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    document.querySelectorAll('.stat-num').forEach(animateCounter);
  }
}, { threshold: 0.3 });
counterObserver.observe(statsStrip);


// ══ HERO TERMINAL TYPEWRITER ══
const termBody = document.getElementById('termBody');
const lines = [
  { cls: 't-prompt', text: '$ ' },
  { cls: 't-cmd',    text: 'kubectl get pods --all-namespaces' },
  { cls: 't-ok',     text: '✔ main-service     Running  3/3   5m' },
  { cls: 't-ok',     text: '✔ auth-service     Running  2/2   12m' },
  { cls: 't-warn',   text: '⚠ data-pipeline   Pending  0/3   1m' },
  { cls: 't-prompt', text: '$ ' },
  { cls: 't-cmd',    text: 'docker build -t devops-hub:latest .' },
  { cls: 't-info',   text: 'Step 1/8 : FROM node:20-alpine' },
  { cls: 't-info',   text: 'Step 2/8 : WORKDIR /app' },
  { cls: 't-ok',     text: '✔ Successfully built a3bf29cd91e4' },
];

let lineIdx = 0;
let charIdx = 0;
let currentEl = null;

function typeNextChar() {
  if (lineIdx >= lines.length) {
    // Add blinking cursor at end
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    termBody.appendChild(cursor);
    return;
  }

  const line = lines[lineIdx];

  if (charIdx === 0) {
    // New line element (combine prompt+cmd on same row)
    if (line.cls === 't-prompt') {
      currentEl = document.createElement('div');
      currentEl.className = 'term-line';
      termBody.appendChild(currentEl);
    }
  }

  if (charIdx < line.text.length) {
    const span = document.createElement('span');
    span.className = line.cls;
    span.textContent = line.text[charIdx];
    (currentEl || termBody).appendChild(span);
    charIdx++;
    termBody.scrollTop = termBody.scrollHeight;
    setTimeout(typeNextChar, line.cls === 't-cmd' ? 55 : 18);
  } else {
    charIdx = 0;
    lineIdx++;
    if (lines[lineIdx] && lines[lineIdx].cls !== 't-cmd' && lines[lineIdx].cls !== 't-prompt') {
      // Output lines get their own row
      currentEl = document.createElement('div');
      currentEl.className = 'term-line';
      termBody.appendChild(currentEl);
    }
    setTimeout(typeNextChar, lineIdx < lines.length ? 80 : 400);
  }
}

setTimeout(typeNextChar, 800);


// ══ LIVE METRICS ══
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

function updateMetrics() {
  const cpu  = rand(18, 85);
  const mem  = rand(40, 78);
  const disk = rand(10, 60);
  const net  = rand(5,  90);

  const set = (valId, barId, value, unit = '%') => {
    document.getElementById(valId).textContent = value + unit;
    document.getElementById(barId).style.width = value + '%';
  };

  set('cpuVal',  'cpuBar',  cpu);
  set('memVal',  'memBar',  mem);
  set('diskVal', 'diskBar', disk, ' MB/s');
  set('netVal',  'netBar',  net);
}

updateMetrics();
setInterval(updateMetrics, 4000);


// ══ DEPLOYMENT LOGS ══
const logBody = document.getElementById('logBody');

const seedLogs = [
  { cls: 't-ok',   text: '[15:30:01] ✔ auth-service v2.4.1 deployed to Production' },
  { cls: 't-info', text: '[15:28:44] ℹ  Docker image pushed: auth-service:2.4.1' },
  { cls: 't-info', text: '[15:27:12] ℹ  Tests passed: 248/248' },
  { cls: 't-warn', text: '[15:15:03] ⚠  data-pipeline test suite failed — retrying' },
  { cls: 't-err',  text: '[15:14:52] ✖  data-pipeline build error: ENOMEM' },
  { cls: 't-ok',   text: '[15:01:20] ✔  main-service v3.0.0 rolled out (canary 10%)' },
];

function appendLog(text, cls = 't-info') {
  const line = document.createElement('div');
  line.className = `term-line ${cls}`;
  line.textContent = text;
  logBody.appendChild(line);
  logBody.scrollTop = logBody.scrollHeight;
}

seedLogs.forEach(l => appendLog(l.text, l.cls));

document.getElementById('clearLogsBtn').addEventListener('click', () => {
  logBody.innerHTML = '';
  showToast('🗑 Logs cleared');
});

const fakeLogs = [
  { cls: 't-ok',   text: '✔ Scaled main-service to 5 replicas' },
  { cls: 't-info', text: 'ℹ  Health check passed on all pods' },
  { cls: 't-warn', text: '⚠  High memory usage on node-3 (88%)' },
  { cls: 't-ok',   text: '✔ SSL certificate renewed automatically' },
  { cls: 't-info', text: 'ℹ  Backup snapshot created successfully' },
  { cls: 't-err',  text: '✖  Connection timeout on db-replica-2' },
];
let fakeIdx = 0;

document.getElementById('addLogBtn').addEventListener('click', () => {
  const now = new Date().toLocaleTimeString('en-GB');
  const entry = fakeLogs[fakeIdx % fakeLogs.length];
  appendLog(`[${now}] ${entry.text}`, entry.cls);
  fakeIdx++;
  showToast('📋 Log entry added');
});


// ══ RUN PIPELINE ══
document.getElementById('runPipelineBtn').addEventListener('click', () => {
  const now = new Date().toLocaleTimeString('en-GB');
  appendLog(`[${now}] ▶  New pipeline triggered for main-service`, 't-info');
  showToast('▶ Pipeline started!');

  // Reset stages of main pipeline card
  const stages = document.querySelectorAll('#pipe-main .stage');
  const statusEl = document.getElementById('pipe-main-status');
  const fill = document.querySelector('#pipe-main .pipe-fill');

  stages.forEach(s => { s.className = 'stage'; });
  statusEl.className = 'pipe-status running';
  statusEl.textContent = 'Running';
  fill.style.width = '0%';

  let step = 0;
  const totalSteps = stages.length;
  const interval = setInterval(() => {
    if (step > 0) stages[step - 1].classList.add('done');
    if (step < totalSteps) {
      stages[step].classList.add('active');
      fill.style.width = ((step + 1) / totalSteps * 100) + '%';
      step++;
    } else {
      clearInterval(interval);
      statusEl.className = 'pipe-status success';
      statusEl.textContent = 'Success';
      appendLog(`[${new Date().toLocaleTimeString('en-GB')}] ✔ Pipeline completed successfully`, 't-ok');
      showToast('✅ Pipeline complete!');
    }
  }, 1200);
});


// ══ DEPLOY MODAL ══
const overlay      = document.getElementById('modalOverlay');
const deployBtn    = document.getElementById('deployBtn');
const cancelDeploy = document.getElementById('cancelDeploy');
const confirmDeploy = document.getElementById('confirmDeploy');

deployBtn.addEventListener('click', () => overlay.classList.add('open'));
cancelDeploy.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

confirmDeploy.addEventListener('click', () => {
  const svc = document.getElementById('deployService').value;
  const env = document.getElementById('deployEnv').value;
  overlay.classList.remove('open');
  const now = new Date().toLocaleTimeString('en-GB');
  appendLog(`[${now}] 🚀 Deploying ${svc} → ${env}`, 't-info');
  showToast(`🚀 Deploying ${svc} to ${env}!`);
});


// ══ TOAST HELPER ══
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
