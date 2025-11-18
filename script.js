/*==============================================================================
  script.js
  - Smooth scrolling helpers
  - Scroll spy for navigation
  - IntersectionObserver for skills progress bars and project cards (staggered)
  - Contact form client-side validation
==============================================================================*/

document.addEventListener('DOMContentLoaded', function () {
  // Update footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open');
    });
  }

  /* ===========================
     Smooth Scrolling for anchors
     - We use native CSS scroll-behavior and also prevent abrupt jumps for JS-triggered scrolls
  ============================*/
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        // close mobile nav if open
        if (mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        // Smooth scroll with offset to account for sticky header
        const headerOffset = document.getElementById('header').offsetHeight + 8;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ===========================
     Scroll Spy / Active Navigation
     - Using IntersectionObserver to detect which section is in viewport
  ============================*/
  const sections = document.querySelectorAll('main section[id]');
  const navMap = {};
  navLinks.forEach(a => {
    const id = a.getAttribute('data-target');
    if (id) navMap[id] = a;
  });

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const navLink = navMap[id];
      if (!navLink) return;
      if (entry.isIntersecting) {
        // remove active from all, then set this
        document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50% 0px', // trigger when section's middle reaches viewport
    threshold: 0
  });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ===========================
     Animate Skills Progress Bars on Scroll
     - Each .progress has data-value attribute with target percent
     - Bars animate from 0 to target when .skills section enters viewport
  ============================*/
  const skillSection = document.querySelector('#skills');
  const progressBars = document.querySelectorAll('.progress');

  if (skillSection && progressBars.length) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const value = parseInt(bar.getAttribute('data-value'), 10) || 0;
            const inner = bar.querySelector('.progress-bar');
            // set width to target value (CSS transition handles animation)
            inner.style.width = value + '%';
            // Update percent label (if you want to add dynamic percent number)
            const percentLabel = bar.previousElementSibling?.querySelector('.skill-percent');
            if (percentLabel) {
              let start = 0;
              const duration = 900;
              const stepTime = 15;
              const steps = Math.ceil(duration / stepTime);
              const increment = (value - start) / steps;
              let current = start;
              const interval = setInterval(() => {
                current += increment;
                percentLabel.textContent = Math.round(current) + '%';
                if (current >= value) {
                  percentLabel.textContent = value + '%';
                  clearInterval(interval);
                }
              }, stepTime);
            }
          });
          skillObserver.unobserve(skillSection); // animate once
        }
      });
    }, { root: null, threshold: 0.12 });

    skillObserver.observe(skillSection);
  }

  /* ===========================
     Projects Staggered Animation
     - When projects section intersects, add visible class to each .card-inner with delay
  ============================*/
  const projectsSection = document.querySelector('#projects');
  const projectCards = document.querySelectorAll('.project-card .card-inner');

  if (projectsSection && projectCards.length) {
    const projectsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          projectCards.forEach((card, idx) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, idx * 120); // stagger 120ms
          });
          projectsObserver.unobserve(projectsSection);
        }
      });
    }, { root: null, threshold: 0.12 });

    projectsObserver.observe(projectsSection);
  }

  /* ===========================
     Simple contact form handling (client-side)
     - Prevent actual submit; validate and show success / error feedback
  ============================*/
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const honeypot = formData.get('website');
      const status = document.querySelector('.form-status');

      // basic anti-spam check
      if (honeypot) {
        status.textContent = 'Spam detected.';
        status.style.color = 'red';
        return;
      }

      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const message = formData.get('message')?.trim();

      if (!name || !email || !message) {
        status.textContent = 'Mohon isi semua field yang diperlukan.';
        status.style.color = 'crimson';
        return;
      }

      // rudimentary email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        status.textContent = 'Mohon masukkan alamat email yang valid.';
        status.style.color = 'crimson';
        return;
      }

      // Simulate async send
      status.textContent = 'Mengirim...';
      status.style.color = 'var(--color-muted)';

      setTimeout(() => {
        status.textContent = 'Terima kasih! Pesan Anda telah dikirim (simulasi).';
        status.style.color = 'green';
        contactForm.reset();
      }, 900);
    });
  }

  /* ===========================
     Small UX: add shadow to header on scroll
  ============================*/
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) header.style.boxShadow = '0 8px 28px rgba(18,28,43,0.06)';
    else header.style.boxShadow = 'none';
  });

});