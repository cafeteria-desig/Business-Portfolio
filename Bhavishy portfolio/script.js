/* ══════════════════════════════════════════════════════════
   BHAVISHY SANKHLA – PORTFOLIO  |  script.js
══════════════════════════════════════════════════════════ */

// ─── 1. LOADER ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 900);
});
document.body.style.overflow = 'hidden';

// ─── 2. CUSTOM CURSOR ───────────────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let trailX = 0, trailY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
});

(function animateCursor() {
  trailX += (cursorX - trailX) * 0.12;
  trailY += (cursorY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hide/show cursor
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '0.6';
});

// ─── 3. PARTICLES ───────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.2 + 0.3,
      o:  Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.o})`;
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

// ─── 4. NAVBAR ──────────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

// ─── 5. TYPED ROLES ANIMATION ──────────────────────────────────────────
function initAnimations() {
  const roles = [
    'CS Engineering Student',
    'Data Science Enthusiast',
    'Python Developer',
    'Problem Solver',
    'Future Software Engineer',
  ];
  let rIdx = 0, cIdx = 0, deleting = false;
  const el = document.getElementById('typed-role');

  function type() {
    const current = roles[rIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();

  // Scroll-reveal
  setupScrollReveal();
  // Skill bars
  setupSkillBars();
}

// ─── 6. SCROLL REVEAL ───────────────────────────────────────────────────
function setupScrollReveal() {
  const items = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

// ─── 7. SKILL BARS ──────────────────────────────────────────────────────
function setupSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const pct    = target.getAttribute('data-width');
        // Small delay for visual punch
        setTimeout(() => { target.style.width = pct + '%'; }, 300);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(el => observer.observe(el));
}

// ─── 8. CONTACT FORM ────────────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('form-submit-btn');
  const name   = document.getElementById('name').value.trim();
  const email  = document.getElementById('email').value.trim();
  const msg    = document.getElementById('message').value.trim();

  // Simple validation
  if (!name || !email || !msg) {
    status.textContent = '⚠ Please fill in all fields.';
    status.className   = 'form-status error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = '⚠ Please enter a valid email address.';
    status.className   = 'form-status error';
    return;
  }

  // Simulate sending
  btn.disabled = true;
  const btnText = btn.querySelector('.btn-text');
  const original = btnText.textContent;
  btnText.textContent = 'Sending…';

  setTimeout(() => {
    status.textContent = '✓ Message sent! I\'ll get back to you soon.';
    status.className   = 'form-status success';
    this.reset();
    btnText.textContent = original;
    btn.disabled = false;
    setTimeout(() => { status.textContent = ''; }, 5000);
  }, 1400);
});

// ─── 9. SMOOTH SCROLL FOR HERO EXPLORE BUTTON ──────────────────────────
document.getElementById('hero-explore-btn').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// ─── 10. BACK-TO-TOP BUTTON ─────────────────────────────────────────────
document.getElementById('back-to-top').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── 11. PARALLAX HERO VISUAL ───────────────────────────────────────────
window.addEventListener('scroll', () => {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    const scrolled = window.scrollY;
    heroVisual.style.transform = `translateY(${scrolled * 0.12}px)`;
  }
});

// ─── 12. HOVER GLOW EFFECT ON GLASS CARDS ──────────────────────────────
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ─── 13. TILT EFFECT ON AVATAR ──────────────────────────────────────────
const heroVisualEl = document.querySelector('.hero-visual');
if (heroVisualEl) {
  document.addEventListener('mousemove', e => {
    const cx  = window.innerWidth  / 2;
    const cy  = window.innerHeight / 2;
    const dx  = (e.clientX - cx) / cx;
    const dy  = (e.clientY - cy) / cy;
    const rotX = dy * -8;
    const rotY = dx *  8;
    heroVisualEl.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${window.scrollY * 0.12}px)`;
  });
}

// ─── 14. INTEREST CARDS STAGGER ─────────────────────────────────────────
// Already handled by animate-on-scroll with --delay CSS vars.
// Extra: subtle float animation
document.querySelectorAll('.interest-card').forEach((card, i) => {
  card.style.animationDelay = (i * 0.08) + 's';
});

// ─── 15. NAV LINK RIPPLE ────────────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; width:6px; height:6px;
      background:var(--gold); border-radius:50%;
      left:${e.offsetX}px; top:${e.offsetY}px;
      transform:translate(-50%,-50%) scale(0);
      animation: rippleAnim 0.5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'visible';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%,-50%) scale(8); opacity: 0; }
  }
`;
document.head.appendChild(style);
