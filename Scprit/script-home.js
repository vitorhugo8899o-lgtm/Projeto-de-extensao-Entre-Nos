// ---------- Tema claro/escuro ----------
const toggle = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');
const label = document.getElementById('theme-label');
const root = document.documentElement;

const moonPath = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z';
const sunPaths = `
  <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/>
  <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
`;

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (icon) icon.innerHTML = sunPaths;
    if (label) label.textContent = 'Modo claro';
  } else {
    root.removeAttribute('data-theme');
    if (icon) icon.innerHTML = `<path d="${moonPath}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (label) label.textContent = 'Modo escuro';
  }
  localStorage.setItem('entre-nos-theme', theme);
}

const saved = localStorage.getItem('entre-nos-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved || (prefersDark ? 'dark' : 'light'));

if (toggle) {
  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
}

const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });
}

const sections = ['inicio', 'sobre', 'materiais', 'projetos']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll('nav a, .mobile-nav a');

if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLinks = document.querySelectorAll(`a[href="#${entry.target.id}"], a[href$="#${entry.target.id}"]`);
        activeLinks.forEach(l => l.classList.add('active'));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');
const body = document.body;

function openMobileNav() {
  hamburgerBtn.classList.add('active');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('active');
  mobileNavOverlay.classList.add('active');
  mobileNav.setAttribute('aria-hidden', 'false');
  body.classList.add('nav-locked');
}

function closeMobileNav() {
  hamburgerBtn.classList.remove('active');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('active');
  mobileNavOverlay.classList.remove('active');
  mobileNav.setAttribute('aria-hidden', 'true');
  body.classList.remove('nav-locked');
}

if (hamburgerBtn && mobileNav && mobileNavOverlay) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('active');
    isOpen ? closeMobileNav() : openMobileNav();
  });

  mobileNavOverlay.addEventListener('click', closeMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });
}
