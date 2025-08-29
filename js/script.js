window.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  const heroContent = document.getElementById('heroContent');
  const mainContent = document.getElementById('main-content');
  const heroSubtext = document.getElementById('heroSubtext');

  // Fade in the hero first
  setTimeout(() => {
    hero.classList.add('fade-in');
  }, 160); // small delay to trigger transition

  // Fade in the hero font
  setTimeout(() => {
    heroContent.classList.add('fade-in');
  }, 1500); // small delay to trigger transition


  // Fade in the hero font subtext
  setTimeout(() => {
    heroSubtext.classList.add('fade-in');
  }, 3350); // small delay to trigger transition


  // Fade in the rest of the page after hero
  setTimeout(() => {
    mainContent.classList.add('fade-in');
  }, 1000); // matches hero fade duration + small buffer
});


// Navbar shadow on scroll
document.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  if (window.scrollY > 8) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});


// ---- Reveal on scroll ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Navbar fade in after hero ----
const hero = document.querySelector('#hero');
const nav = document.querySelector('.navbar');
if (hero && nav) {
  const navObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      // On hero: hide / transparent navbar
      document.body.classList.remove('nav-visible');
    } else {
      // Past hero: show navbar
      document.body.classList.add('nav-visible');
    }
  }, { threshold: 0.3 });
  navObserver.observe(hero);
}


// Auto-add .reveal to common content blocks if markup lacks it
document.querySelectorAll('section, .container > .row, .card, .feature, .content-block')
  .forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });


document.addEventListener('DOMContentLoaded', () => {
  // ---- Add .reveal to common content blocks ----
  const revealSelectors = [
    'section',
    'main > *',
    '.container > .row',
    '.card',
    '.feature',
    '.content-block',
    '[id*="services" i]',
    '[id*="about" i]',
    '[id*="group" i]',
    '[id*="contact" i]'
  ];
  const toMark = new Set();
  revealSelectors.forEach(sel => document.querySelectorAll(sel).forEach(el => toMark.add(el)));
  toMark.forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });

  // ---- Reveal on scroll ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---- Navbar fade in after hero ----
  const hero = document.querySelector('#hero');
  const nav = document.querySelector('.navbar');
  if (hero && nav) {
    const navObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        document.body.classList.remove('nav-visible');
      } else {
        document.body.classList.add('nav-visible');
      }
    }, { threshold: 0.05 });
    navObserver.observe(hero);

    // initialize state on load (in case hero not in view initially)
    const initRect = hero.getBoundingClientRect();
    if (initRect.top <= 0 || initRect.bottom <= 0) {
      document.body.classList.add('nav-visible');
    }
  } else {
    // If no hero, just show navbar
    document.body.classList.add('nav-visible');
  }
});


// --- Show navbar only after user starts scrolling ---
(function() {
  function updateNavVisibility() {
    if (window.scrollY > 10) {
      document.body.classList.add('nav-visible');
    } else {
      document.body.classList.remove('nav-visible');
    }
  }
  document.addEventListener('scroll', updateNavVisibility, { passive: true });
  document.addEventListener('DOMContentLoaded', updateNavVisibility);
  window.addEventListener('load', updateNavVisibility);
})();


// --- Upgrade: no-reflow navbar already handled in CSS; keep visibility flag ---

// --- Carousel duplicator for seamless loop ---
(function(){
  const track = document.querySelector('.pt-carousel .track');
  if(!track) return;
  const items = Array.from(track.children);
  items.forEach(n => track.appendChild(n.cloneNode(true))); // duplicate for 200% width
})();
