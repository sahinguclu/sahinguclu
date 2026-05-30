

document.addEventListener('DOMContentLoaded', () => {

  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
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

});
