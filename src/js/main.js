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
