

document.addEventListener('DOMContentLoaded', () => {

  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  // ── Custom Cursor ──
  initCustomCursor();

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateLavaColors();
  });

  const txtRotate = document.getElementById('txtRotate');
  if (txtRotate) {
    const phrases = [
      'whatever comes to mind.',
      'tools from random ideas.',
      'stuff that needs making.',
      'things that bug me.',
      'open source projects.',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeLoop() {
      const current = phrases[phraseIdx];

      if (isDeleting) {
        txtRotate.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        txtRotate.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIdx === current.length) {

        typeSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 600);
  }

  const scrambleElements = [
    document.getElementById('heroNameFirst'),
    document.getElementById('heroNameAccent'),
  ].filter(Boolean);

  if (scrambleElements.length > 0) {
    const chars = '!<>-_\\/[]{}?+*^%#@&$';
    const duration = 2600;
    const stepMs = 50;
    const steps = Math.floor(duration / stepMs);
    let currentStep = 0;

    const originals = scrambleElements.map(el => el.textContent);

    function scramble(text) {
      return text
        .split('')
        .map(char => (char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
        .join('');
    }

    scrambleElements.forEach(el => {
      el.textContent = scramble(el.textContent);
      el.classList.add('scrambling');
    });

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const revealBase = Math.floor(progress * 12);
      const glitch = Math.random() < 0.18;

      scrambleElements.forEach((el, i) => {
        const original = originals[i];
        const bonus = i === 0 ? 0 : 2;
        const revealForThis = Math.min(original.length, revealBase + bonus);

        if (glitch) {
          el.textContent = scramble(original);
        } else {
          let result = '';
          for (let j = 0; j < original.length; j++) {
            if (original[j] === ' ') {
              result += ' ';
            } else if (j < revealForThis) {
              result += original[j];
            } else {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          el.textContent = result;
        }
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        scrambleElements.forEach((el, i) => {
          el.textContent = originals[i];
          el.classList.remove('scrambling');
        });
      }
    }, stepMs);
  }

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  const revealElements = document.querySelectorAll(
    '.project-header, .project-desc, .project-features, .gallery-wrapper, .about-content, .stat'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));

  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = section.getAttribute('id');
      }
    });

    navAnchors.forEach(anchor => {
      anchor.classList.remove('active');
      if (anchor.getAttribute('href') === '#' + currentId) {
        anchor.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav(); // initial call

  const galleryPrevBtns = document.querySelectorAll('.gallery-prev');
  const galleryNextBtns = document.querySelectorAll('.gallery-next');

  galleryPrevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const galleryId = btn.getAttribute('data-gallery');
      const gallery = document.getElementById(galleryId);
      if (gallery) {
        gallery.scrollBy({ left: -360, behavior: 'smooth' });
      }
    });
  });

  galleryNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const galleryId = btn.getAttribute('data-gallery');
      const gallery = document.getElementById(galleryId);
      if (gallery) {
        gallery.scrollBy({ left: 360, behavior: 'smooth' });
      }
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentLightboxItems = [];
  let currentLightboxIndex = 0;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {

      const track = item.closest('.gallery-track');
      if (!track) return;

      currentLightboxItems = Array.from(track.querySelectorAll('.gallery-item'));
      currentLightboxIndex = currentLightboxItems.indexOf(item);

      showLightboxImage(currentLightboxIndex);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function showLightboxImage(index) {
    if (currentLightboxItems.length === 0) return;
    const item = currentLightboxItems[index];
    const fullSrc = item.getAttribute('data-full');
    const caption = item.getAttribute('data-caption') || '';

    lightboxImg.src = fullSrc;
    lightboxImg.alt = item.querySelector('img')?.alt || '';
    lightboxCaption.textContent = caption;

    lightboxPrev.style.display = currentLightboxItems.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = currentLightboxItems.length > 1 ? 'flex' : 'none';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';

    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxItems.length) % currentLightboxItems.length;
    showLightboxImage(currentLightboxIndex);
  });

  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxItems.length;
    showLightboxImage(currentLightboxIndex);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxItems.length) % currentLightboxItems.length;
        showLightboxImage(currentLightboxIndex);
        break;
      case 'ArrowRight':
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxItems.length;
        showLightboxImage(currentLightboxIndex);
        break;
    }
  });

  document.querySelector('.nav-links a[href="#home"]')?.addEventListener('click', (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ═══════════════════════════════════════════
  //  Lava Lamp Background
  // ═══════════════════════════════════════════

  const DARK_ACCENTS  = ['#C8102E','#D42A3F','#A00D24','#E0404A','#B81835','#8A0A1E','#CC1A35'];
  const LIGHT_ACCENTS = ['#B01028','#C42038','#8C0C20','#D0303A','#A0142E','#7A0818','#B81835'];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function updateLavaColors() {
    const orbs = document.querySelectorAll('.lava-orb');
    if (!orbs.length) return;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const palette = isDark ? DARK_ACCENTS : LIGHT_ACCENTS;
    orbs.forEach(orb => {
      orb.style.background = palette[Math.floor(Math.random() * palette.length)];
    });
  }

  function initLavaLamp() {
    const orbs = document.querySelectorAll('.lava-orb');
    if (!orbs.length) return;

    orbs.forEach(orb => {
      // Random size (big blurred blobs)
      const size = randomBetween(250, 650);
      orb.style.width  = size + 'px';
      orb.style.height = size + 'px';

      // Random position (edge-bleed so blobs peek in from off-screen)
      orb.style.top  = randomBetween(-30, 100) + '%';
      orb.style.left = randomBetween(-30, 100) + '%';

      // Random animation timing
      orb.style.setProperty('--bd',    randomBetween(20, 40) + 's');
      orb.style.setProperty('--bdelay', randomBetween(-20, 0) + 's');
    });

    updateLavaColors();
  }

  initLavaLamp();

  // ═══════════════════════════════════════════
  //  Custom Cursor
  // ═══════════════════════════════════════════

  const INTERACTIVE_SELECTOR =
    'a, button, .btn, .gallery-item, .theme-toggle, ' +
    '.scroll-indicator, .lightbox-close, .lightbox-prev, ' +
    '.lightbox-next, .mobile-menu-btn, .nav-links a, ' +
    'input, textarea, select, [role="button"]';

  function isTouchDevice() {
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }

  function initCustomCursor() {
    // ── Bail out on touch devices ──
    if (isTouchDevice()) return;

    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── State ──
    let mouseX = -200;
    let mouseY = -200;
    let ringX  = -200;
    let ringY  = -200;
    let isHovering = false;
    let isVisible  = false;
    let raf = null;
    let idleTimer = null;
    const IDLE_DELAY = 3000;

    // ── Read accent on init ──
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const accentGlow  = getComputedStyle(document.documentElement).getPropertyValue('--accent-glow').trim();

    function updateAccentColors() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      if (isDark) {
        dot.style.background = '#C8102E';
        ring.style.setProperty('--ring-color', 'rgba(200, 16, 46, 0.4)');
        ring.style.setProperty('--ring-hover-color', 'rgba(200, 16, 46, 0.7)');
        TRAIL_COLORS = ['#C8102E','#D42A3F','#E0404A','#B81835','#CC1A35'];
      } else {
        dot.style.background = '#B01028';
        ring.style.setProperty('--ring-color', 'rgba(176, 16, 40, 0.4)');
        ring.style.setProperty('--ring-hover-color', 'rgba(176, 16, 40, 0.7)');
        TRAIL_COLORS = ['#B01028','#C42038','#D0303A','#A0142E','#B81835'];
      }
    }

    // ── Particle Trail Pool ──
    const TRAIL_SIZE = 25;
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail';
    trailContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(trailContainer);

    const trailParticles = [];
    for (let i = 0; i < TRAIL_SIZE; i++) {
      const p = document.createElement('span');
      p.className = 'trail-particle';
      trailContainer.appendChild(p);
      trailParticles.push(p);
    }
    let trailIdx = 0;
    let lastSpawnTime = 0;
    let lastSpawnX = 0;
    let lastSpawnY = 0;

    trailContainer.addEventListener('animationend', (e) => {
      if (e.target.classList.contains('trail-particle')) {
        e.target.classList.remove('active');
      }
    });

    let TRAIL_COLORS = ['#C8102E','#D42A3F','#E0404A','#B81835','#CC1A35'];

    function spawnParticle(x, y) {
      const now = performance.now();
      if (now - lastSpawnTime < 65) return;          // throttle: max every 65ms

      // Capture delta BEFORE updating lastSpawn
      const dist = Math.hypot(x - lastSpawnX, y - lastSpawnY);
      if (dist < 4) return;                           // skip if barely moved

      lastSpawnTime = now;
      lastSpawnX = x;
      lastSpawnY = y;

      const p = trailParticles[trailIdx % TRAIL_SIZE];
      trailIdx++;

      // Restart CSS animation — remove, reset, re-add
      p.classList.remove('active');
      p.style.animation = 'none';
      p.offsetHeight;               // trigger reflow
      p.style.animation = '';
      p.classList.add('active');

      const size = 2 + Math.random() * 3;  // 2–5px dots
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
    }

    // ── Show / Hide ──
    function show() {
      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('cursor-hidden');
        ring.classList.remove('cursor-hidden');
      }
    }

    function hide() {
      if (isVisible) {
        isVisible = false;
        dot.classList.add('cursor-hidden');
        ring.classList.add('cursor-hidden');
        isHovering = false;
        dot.classList.remove('cursor-hover', 'cursor-click', 'cursor-idle');
        ring.classList.remove('cursor-hover', 'cursor-click', 'cursor-idle');
      }
    }

    // ── Idle reset ──
    function resetIdle() {
      clearTimeout(idleTimer);
      dot.classList.remove('cursor-idle');
      ring.classList.remove('cursor-idle');
      idleTimer = setTimeout(() => {
        if (isVisible && !isHovering) {
          ring.classList.add('cursor-idle');
        }
      }, IDLE_DELAY);
    }

    // ── Render loop (frame-rate adaptive) ──
    let prevTimestamp = performance.now();
    let glowSpeed = 0;
    let prevGlowX = 0;
    let prevGlowY = 0;

    function render(timestamp) {
      if (!isVisible) {
        raf = null;
        return;
      }

      const dt = Math.min((timestamp - prevTimestamp) / 1000, 0.1);
      prevTimestamp = timestamp;

      // Frame-rate-independent lerp (exponential decay)
      // Same visual smoothness at 60Hz, 120Hz, 144Hz, 240Hz
      const lerpRate = prefersReduced ? 999 : (isHovering ? 12 : 5);
      const t = 1 - Math.exp(-lerpRate * dt);
      ringX += (mouseX - ringX) * t;
      ringY += (mouseY - ringY) * t;

      // Position via top/left — CSS transform: translate(-50%,-50%) handles centering
      dot.style.left  = mouseX + 'px';
      dot.style.top   = mouseY + 'px';
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';

      // Speed-reactive glow (px-per-second, frame-rate independent)
      if (dt > 0.005) {
        const dx = mouseX - prevGlowX;
        const dy = mouseY - prevGlowY;
        const pxPerSec = Math.hypot(dx, dy) / Math.max(dt, 0.001);
        glowSpeed += (pxPerSec - glowSpeed) * 0.2;           // smooth the speed
        const s = Math.min(glowSpeed / 2000, 1);             // normalize 0–2000 px/s → 0–1
        const glowPx = 4 + s * 18;                           // 4px → 22px
        const glowAlpha = 0.05 + s * 0.3;                    // 0.05 → 0.35
        if (!isHovering) {
          ring.style.boxShadow = `0 0 ${glowPx}px rgba(200, 16, 46, ${glowAlpha})`;
        }
        prevGlowX = mouseX;
        prevGlowY = mouseY;
      }

      raf = requestAnimationFrame(render);
    }

    function startLoop() {
      if (!raf) {
        raf = requestAnimationFrame(render);
      }
    }

    function stopLoop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    // ── Mouse movement ──
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      show();
      resetIdle();
      startLoop();
      spawnParticle(e.clientX, e.clientY);
    }, { passive: true });

    // ── Enter / Leave window ──
    document.addEventListener('mouseenter', () => {
      show();
      startLoop();
    });

    document.addEventListener('mouseleave', () => {
      hide();
      stopLoop();
    });

    // ── Hover detection (event delegation) ──
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (target) {
        isHovering = true;
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
        ring.classList.remove('cursor-idle');
      } else {
        isHovering = false;
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      }
    });

    // ── Click pulse + ripple ──
    document.addEventListener('mousedown', (e) => {
      dot.classList.add('cursor-click');
      ring.classList.add('cursor-click');
      ring.classList.remove('cursor-idle');

      // Click ripple
      if (isVisible) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      }
    });

    document.addEventListener('mouseup', () => {
      dot.classList.remove('cursor-click');
      ring.classList.remove('cursor-click');
    });

    // ── Window focus / blur ──
    window.addEventListener('blur', () => {
      hide();
      stopLoop();
    });

    window.addEventListener('focus', () => {
      // Cursor will reappear on next mousemove
    });

    // ── Theme change ──
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(updateAccentColors, 50);
      });
    }

    // ── Initial position (off-screen until first mousemove) ──
    dot.style.left  = '-200px';
    dot.style.top   = '-200px';
    ring.style.left = '-200px';
    ring.style.top  = '-200px';
    dot.classList.add('cursor-hidden');
    ring.classList.add('cursor-hidden');

    // ── Set accent colors from current theme ──
    updateAccentColors();
  }

});
