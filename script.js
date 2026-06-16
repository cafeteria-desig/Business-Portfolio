/* ═══════════════════════════════════════════════════════════════
   LMC TECH CREW — BUSINESS PORTFOLIO
   script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── LOADER ────────────────────────────────────────────────────
(function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 25;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
    }
    progress.style.width = pct + '%';
  }, 90);
  document.body.style.overflow = 'hidden';
})();

// ── ANIMATED BG CANVAS ───────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle grid + floating dots
  const dots = Array.from({ length: 80 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,212,255,0.03)';
    ctx.lineWidth = 1;
    const gap = 80;
    for (let x = 0; x < canvas.width; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Floating particles
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${d.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── CUSTOM CURSOR ─────────────────────────────────────────────
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  document.querySelectorAll('a, button, .member-card, .project-card, .ibm-course-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(168,85,247,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0,212,255,0.5)';
    });
  });
})();

// ── NAVBAR ────────────────────────────────────────────────────
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
})();

// ── SCROLL REVEAL ─────────────────────────────────────────────
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .animate-in').forEach(el => observer.observe(el));
})();

// ── COUNTER ANIMATION ─────────────────────────────────────────
(function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const duration = 1400;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const iv = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString();
            if (current >= target) clearInterval(iv);
          }, 16);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const band = document.querySelector('.stats-band');
  if (band) observer.observe(band);
})();

// ── CONTACT FORM ──────────────────────────────────────────────
(function initForm() {
  const form     = document.getElementById('contactForm');
  const btn      = document.getElementById('cfSubmit');
  const btnText  = document.getElementById('cfBtnText');
  const feedback = document.getElementById('cfFeedback');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('cfName').value.trim();
    const email   = document.getElementById('cfEmail').value.trim();
    const subject = document.getElementById('cfSubject').value.trim();
    const message = document.getElementById('cfMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    btn.disabled = true;
    btnText.textContent = 'Sending…';

    setTimeout(() => {
      showFeedback('✓ Message sent! We\'ll get back to you shortly.', 'success');
      form.reset();
      btn.disabled = false;
      btnText.textContent = 'Send Message';
    }, 1500);
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + type;
    setTimeout(() => {
      feedback.className = 'form-feedback';
    }, 5000);
  }
})();

// ── HEX GRID HOVER ────────────────────────────────────────────
(function initHexHover() {
  document.querySelectorAll('.hex').forEach(hex => {
    hex.addEventListener('mouseenter', () => {
      hex.style.transform = 'scale(1.08) translateY(-4px)';
      hex.style.borderColor = 'rgba(0,212,255,0.6)';
      hex.style.boxShadow = '0 8px 24px rgba(0,212,255,0.2)';
    });
    hex.addEventListener('mouseleave', () => {
      hex.style.transform = '';
      hex.style.borderColor = '';
      hex.style.boxShadow = '';
    });
  });
})();

// ── CF PHONE DEMO ANIMATION ───────────────────────────────────
(function initCFDemo() {
  const cards = document.querySelectorAll('.cf-issue-card');
  let idx = 0;
  setInterval(() => {
    cards.forEach(c => c.style.opacity = '0.5');
    if (cards[idx]) cards[idx].style.opacity = '1';
    idx = (idx + 1) % cards.length;
  }, 2000);
})();

// ── IBM COURSE CARDS TILT ─────────────────────────────────────
(function initTilt() {
  document.querySelectorAll('.ibm-course-card, .member-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── MEMBER CARD GLOW TRACKING ────────────────────────────────
document.querySelectorAll('.member-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const glow = card.querySelector('.member-card-glow');
    if (glow) {
      glow.style.left = (e.clientX - rect.left) + 'px';
      glow.style.top  = (e.clientY - rect.top)  + 'px';
      glow.style.transform = 'translate(-50%,-50%)';
    }
  });
});

console.log('%c[LMCTECH] Portfolio loaded successfully 🚀', 'color:#00d4ff;font-family:monospace;font-size:12px;font-weight:bold;');
