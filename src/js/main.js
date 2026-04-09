/* ═══════════════════════════════════════════════════════════════
   PAYXEM — Marketing Website JavaScript
   Minimal, performant, no dependencies
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Navigation: scroll state ──────────────────────────────────
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function updateNav() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile menu toggle ────────────────────────────────────────
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('[data-nav-close]').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Smooth scroll for anchor links ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll reveal animation ───────────────────────────────────
  var revealElements = document.querySelectorAll('.reveal');
  var revealTicking = false;

  function checkReveals() {
    var windowHeight = window.innerHeight;
    var triggerPoint = windowHeight * 0.92;

    revealElements.forEach(function (el) {
      if (el.classList.contains('visible')) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < triggerPoint) {
        el.classList.add('visible');
      }
    });

    revealTicking = false;
  }

  function onScrollReveal() {
    if (!revealTicking) {
      revealTicking = true;
      requestAnimationFrame(checkReveals);
    }
  }

  window.addEventListener('scroll', onScrollReveal, { passive: true });
  window.addEventListener('resize', checkReveals, { passive: true });
  checkReveals();
  setTimeout(checkReveals, 100);
  setTimeout(checkReveals, 500);

  // ── Counter animation ─────────────────────────────────────────
  var counters = document.querySelectorAll('[data-counter]');
  var countersDone = [];

  function checkCounters() {
    var windowHeight = window.innerHeight;
    counters.forEach(function (el, i) {
      if (countersDone[i]) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.85) {
        countersDone[i] = true;
        animateCounter(el);
      }
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = prefix + current + (suffix ? ' ' + suffix : '');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters();

  // ── FAQ Accordion ─────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('active');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      item.classList.toggle('active', !isActive);
      this.setAttribute('aria-expanded', !isActive);
      answer.style.maxHeight = isActive ? '0' : answer.scrollHeight + 'px';
    });
  });

  // ── Active nav link on scroll ─────────────────────────────────
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollY = window.scrollY + 150;
    var current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var isActive = href === '#' + current;
      link.style.color = isActive ? 'var(--brand)' : '';
      link.style.fontWeight = isActive ? '600' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
