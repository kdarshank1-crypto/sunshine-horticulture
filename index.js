/**
 * Sunshine Horticultures — Landing Page Interactions
 * --------------------------------------------------
 * Handles: navbar scroll, mobile menu, scroll reveal,
 * stat counter animation, and contact form.
 */

(function () {
  'use strict';

  // ───── Navbar scroll behaviour ─────
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  // ───── Mobile menu toggle ─────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  });

  // ───── Scroll reveal animation ─────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ───── Animated stat counters ─────
  function animateCounter(el, target, suffix) {
    const duration = 2000; // ms
    const start = performance.now();

    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounter(document.getElementById('stat-years'), 15, '+');
          animateCounter(document.getElementById('stat-products'), 20, '+');
          animateCounter(document.getElementById('stat-clients'), 500, '+');
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ───── Contact form handling ─────
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) return;

      // Compose WhatsApp message with form data
      const waText = encodeURIComponent(
        `Hi Sunshine Horticultures! My name is ${name} (${email}).\n\n${message}`
      );

      // Show success state
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');

      // Open WhatsApp with the composed message
      setTimeout(() => {
        window.open(`https://wa.me/60126320259?text=${waText}`, '_blank');
      }, 600);

      // Reset after 4 seconds
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = '';
        formSuccess.classList.remove('show');
      }, 5000);
    });
  }

  // ───── Smooth scroll for anchor links ─────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
})();
