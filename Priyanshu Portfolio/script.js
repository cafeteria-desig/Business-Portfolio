/* ============================================================
   PRIYANSHU RAJPUROHIT — PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ── 1. Custom Cursor ──────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let rafId;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animCursor);
  })();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.7';
  });
})();

/* ── 2. Particle Canvas ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const GOLD = [212, 175, 55];
  const COUNT = 90;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 1.6 + 0.4,
      vx:  (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.3 + 0.05),
      alpha: Math.random() * 0.6 + 0.2,
      da:  (Math.random() - 0.5) * 0.004,
    };
  }

  resize();
  window.addEventListener('resize', () => { resize(); });
  for (let i = 0; i < COUNT; i++) particles.push(randomParticle());

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.alpha += p.da;
      if (p.alpha <= 0.05 || p.alpha >= 0.85) p.da *= -1;
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      if (p.x < -4 || p.x > W + 4) p.x = Math.random() * W;

      // Draw tiny star / glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, `rgba(${GOLD},${p.alpha})`);
      g.addColorStop(1, `rgba(${GOLD},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Connection lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${GOLD},${(1 - dist / 130) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  })();
})();

/* ── 3. Navbar scroll effect & active link ─────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // If core navbar elements are missing, abort safely.
  if (!navbar || !navLinks) return;

  // Scroll → add .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // Init on load
  updateActiveLink();
})();

/* ── 4. Hero Typing Effect ─────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'B.Tech Student',
    'C Programmer',
    'Problem Solver',
    'Algorithm Designer',
    'Aspiring Developer',
    'Future Engineer',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[pIdx];
    el.textContent = deleting
      ? phrase.substring(0, cIdx--)
      : phrase.substring(0, cIdx++);

    let delay = deleting ? 60 : 100;

    if (!deleting && cIdx > phrase.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && cIdx < 0) {
      deleting = false;
      cIdx = 0;
      pIdx = (pIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
})();

/* ── 5. Hero entrance animations ──────────────────────────── */
(function initHeroAnim() {
  const items = document.querySelectorAll('.hero-content .reveal-up');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s`;
    }, 200 + i * 100);
  });
})();

/* ── 6. Scroll Reveal (Intersection Observer) ──────────────── */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.reveal-up:not(.hero-content .reveal-up), .reveal-left, .reveal-right'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── 7. Animated Counter (About stats) ─────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1400;
      const start  = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── 8. Skill Bar Animation ────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.4 });

  fills.forEach(f => observer.observe(f));
})();

/* ── 9. Contact Form ───────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('contactSubmit');
  const btnText = document.getElementById('btnText');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Simple validation
    const inputs = form.querySelectorAll('input, textarea');
    let valid = true;
    inputs.forEach(el => {
      el.style.borderColor = '';
      if (!el.value.trim()) {
        el.style.borderColor = '#c0392b';
        valid = false;
      }
    });
    if (!valid) return;

    // Simulate send (guard optional elements)
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';
    if (btn) btn.style.opacity = '0.75';

    setTimeout(() => {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (btn) btn.style.opacity = '';
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 4000);
      }
    }, 1600);
  });

  // Floating label effect
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('focus',  () => el.parentElement.classList.add('focused'));
    el.addEventListener('blur',   () => el.parentElement.classList.remove('focused'));
  });
})();

/* ── 10. Smooth section scroll with offset ─────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.clientHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── 11. Tilt effect on project cards ─────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .about-card, .skill-category');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -6;
      const tiltY = dx *  6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
})();

/* ── 12. Page load fade-in ─────────────────────────────────── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

/* ── 13. Skill tag hover ripple ────────────────────────────── */
(function initTagRipple() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        background:rgba(212,175,55,0.3);
        transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
        width:80px; height:80px;
        left:${e.offsetX - 40}px; top:${e.offsetY - 40}px;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject keyframe if not already present
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── 14. Section progress bar (top of page) ─────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progressBar';
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; width:0%;
    background:linear-gradient(90deg, #a8871e, #d4af37, #f5d76e);
    z-index:9998; transition:width 0.1s linear;
    box-shadow: 0 0 8px rgba(212,175,55,0.8);
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── 15. "Back to top" button ──────────────────────────────── */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`;
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position:fixed; bottom:32px; right:32px;
    width:48px; height:48px; border-radius:50%;
    background:linear-gradient(135deg,#a8871e,#d4af37);
    color:#060608; border:none; cursor:none;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 24px rgba(212,175,55,0.4), 0 4px 16px rgba(0,0,0,0.4);
    opacity:0; transform:translateY(20px);
    transition:opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
    z-index:500;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity   = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-4px) scale(1.08)';
    btn.style.boxShadow = '0 0 40px rgba(212,175,55,0.7), 0 8px 24px rgba(0,0,0,0.5)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = window.scrollY > 400 ? 'translateY(0)' : 'translateY(20px)';
    btn.style.boxShadow = '0 0 24px rgba(212,175,55,0.4), 0 4px 16px rgba(0,0,0,0.4)';
  });
})();
