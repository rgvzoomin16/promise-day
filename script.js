const sections = document.querySelectorAll('.panel');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-panel');
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => observer.observe(section));

const emojis = ['💖', '✨', '🌸', '💫', '🥺', '❤️‍🔥'];
const words = ['Beautiful', 'Dangerous', 'Mine', 'Magic', 'Home', 'Forever'];
const emojiField = document.getElementById('emoji-field');
const wordCloud = document.getElementById('word-cloud');

function bloom(container, list, className = 'float-emoji') {
  for (let i = 0; i < 16; i += 1) {
    const node = document.createElement('span');
    node.className = className;
    node.textContent = list[Math.floor(Math.random() * list.length)];
    node.style.left = `${Math.random() * 92}%`;
    node.style.top = `${40 + Math.random() * 60}%`;
    node.style.animationDelay = `${Math.random() * 320}ms`;
    container.appendChild(node);
    setTimeout(() => node.remove(), 3000);
  }
}

document.getElementById('emoji-bloom').addEventListener('click', () => bloom(emojiField, emojis));
document.getElementById('burst-btn').addEventListener('click', () => bloom(wordCloud, words, 'float-word'));

const quiz = document.getElementById('love-quiz');
const quizResult = document.getElementById('quiz-result');
quiz.addEventListener('submit', (event) => {
  event.preventDefault();
  quizResult.textContent = 'Correct answer: US, always us. 💞';
  bloom(emojiField, emojis);
});

const heartBtn = document.getElementById('hold-heart');
const heartMsg = document.getElementById('heart-msg');
let holdTimer;

function clearHold() {
  clearTimeout(holdTimer);
  heartBtn.classList.remove('holding');
}

heartBtn.addEventListener('pointerdown', () => {
  heartBtn.classList.add('holding');
  holdTimer = setTimeout(() => {
    heartMsg.textContent = 'This is where you live. 💖';
    bloom(wordCloud, ['💘', 'Vinni', 'Forever', '✨'], 'float-word');
    ping(280, 0.15);
  }, 1500);
});

heartBtn.addEventListener('pointerup', clearHold);
heartBtn.addEventListener('pointerleave', clearHold);

const storm = document.getElementById('storm');
document.getElementById('fireworks').addEventListener('click', () => {
  for (let i = 0; i < 36; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.style.left = '50%';
    spark.style.top = '65%';
    spark.style.setProperty('--x', `${(Math.random() - 0.5) * 320}px`);
    spark.style.setProperty('--y', `${(Math.random() - 0.7) * 320}px`);
    storm.appendChild(spark);
    setTimeout(() => spark.remove(), 1300);
  }
  bloom(storm, emojis);
  ping(540, 0.2);
});

// Floating particle background
const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(80, Math.floor(canvas.width / 18)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.35 - 0.05,
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;

    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
    glow.addColorStop(0, 'rgba(255, 245, 210, 0.95)');
    glow.addColorStop(0.45, 'rgba(255, 213, 106, 0.42)');
    glow.addColorStop(1, 'rgba(162, 107, 61, 0)');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();

// music + interaction sounds
let audioCtx;
function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function ping(freq = 420, gain = 0.12, duration = 0.18) {
  const ac = getAudio();
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  vol.gain.value = gain;
  osc.connect(vol);
  vol.connect(ac.destination);
  osc.start();
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.stop(ac.currentTime + duration);
}

let ambienceOn = false;
let ambienceTimer;
const musicToggle = document.getElementById('music-toggle');
musicToggle.addEventListener('click', () => {
  ambienceOn = !ambienceOn;
  musicToggle.textContent = ambienceOn ? '🎵 Pause Magic' : '🎵 Start Magic';

  if (ambienceOn) {
    const loop = () => {
      if (!ambienceOn) return;
      ping(260, 0.05, 0.6);
      setTimeout(() => ping(330, 0.04, 0.5), 300);
      ambienceTimer = setTimeout(loop, 1800);
    };
    loop();
  } else {
    clearTimeout(ambienceTimer);
  }
});
