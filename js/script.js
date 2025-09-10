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
  }, 3150); // small delay to trigger transition


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
}, { threshold: 0.8 });

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



// Form hooks
(function(){
  const CONTACT_ENDPOINT = window.CONTACT_ENDPOINT || document.querySelector('#contact-form')?.dataset.endpoint || "{{CONTACT_ENDPOINT}}";
  const NEWSLETTER_ENDPOINT = window.NEWSLETTER_ENDPOINT || document.querySelector('#newsletter-form')?.dataset.endpoint || "{{NEWSLETTER_ENDPOINT}}";

  async function submitJSON(form, endpoint){
    if(!endpoint || endpoint.startsWith('{{')){ console.warn('No endpoint configured for', form?.id); return false; }
    const data = Object.fromEntries(new FormData(form).entries());
    try{
      const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      if(!res.ok) throw new Error('Network error'); return true;
    }catch(e){ console.error(e); return false; }
  }

  const cform = document.getElementById('contact-form');
  if(cform){
    cform.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = cform.querySelector('button[type="submit"], button');
      const status = cform.querySelector('.form-status');
      if(btn) btn.disabled = true;  // will fix capitalization next
      if(status) status.textContent = 'Sending...';
      const ok = await submitJSON(cform, CONTACT_ENDPOINT);
      if(ok){ if(status) status.textContent = 'Thanks — I’ll be in touch shortly.'; cform.reset(); }
      else { if(status) status.textContent = 'There was a problem. Please email directly.'; }
      if(btn) btn.disabled = false;
    });
  }

  const nform = document.getElementById('newsletter-form');
  if(nform){
    nform.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = nform.querySelector('button[type="submit"], button');
      const status = nform.querySelector('.form-status');
      if(btn) btn.disabled = true;
      if(status) status.textContent = 'Subscribing...';
      const ok = await submitJSON(nform, NEWSLETTER_ENDPOINT);
      if(ok){ if(status) status.textContent = 'Subscribed! Welcome.'; nform.reset(); }
      else { if(status) status.textContent = 'Could not subscribe — please try again.'; }
      if(btn) btn.disabled = false;
    });
  }
})();

// === Pretty carousel swipe + auto-height ===
(function(){
  var id = 'homepageCarouselPretty';
  function onReady(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  onReady(function(){
    var el = document.getElementById(id);
    if(!el) return;

    // Swipe support
    var startX = 0, deltaX = 0, active = false;
    el.addEventListener('touchstart', function(e){ active = true; startX = e.touches[0].clientX; }, {passive:true});
    el.addEventListener('touchmove', function(e){ if(!active) return; deltaX = e.touches[0].clientX - startX; }, {passive:true});
    el.addEventListener('touchend', function(e){
      if(!active) return;
      if(Math.abs(deltaX) > 40){
        var dir = deltaX > 0 ? 'prev' : 'next';
        var carousel = bootstrap.Carousel.getOrCreateInstance(el);
        carousel[dir]();
      }
      active = false; startX = 0; deltaX = 0;
    }, {passive:true});
  });
})();
// === End pretty carousel helpers ===



// === Endorsements carousel controls ===
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var track = document.querySelector('#endorsementsCarousel .endorsements-track');
    if(!track) return;
    var prev = document.querySelector('.endorsements-btn.prev');
    var next = document.querySelector('.endorsements-btn.next');

    function scrollByCards(dir){
      var card = track.querySelector('.endorsement-card');
      if(!card) return;
      var gap = parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap)||16;
      var amount = card.getBoundingClientRect().width + gap;
      track.scrollBy({ left: dir * amount, behavior:'smooth' });
    }
    prev && prev.addEventListener('click', function(){ scrollByCards(-1); });
    next && next.addEventListener('click', function(){ scrollByCards(1); });

    // Basic touch-swipe for the section
    var startX=0, dx=0, active=false;
    track.addEventListener('touchstart', function(e){ active=true; startX=e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchmove', function(e){ if(!active) return; dx=e.touches[0].clientX - startX; }, {passive:true});
    track.addEventListener('touchend', function(){ if(!active) return; if(Math.abs(dx)>40) scrollByCards(dx>0?-1:1); active=false; dx=0; }, {passive:true});
  });
})();

document.addEventListener("DOMContentLoaded", function() {
  var formContainer = document.getElementById("hs-form-virality-container");
  if (formContainer) {
    formContainer.style.display = "none";   // fully hides it
    // OR: formContainer.style.visibility = "hidden"; // keeps space but hides content
  }
});

