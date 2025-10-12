// --- EVERYTHING runs after DOM is ready *or* after partials are injected ---
(function () {
  // -------- HERO FADES / REVEALS --------
  function initHero() {
    const hero        = document.getElementById('hero');
    const heroContent = document.getElementById('heroContent');
    const heroSubtext = document.getElementById('heroSubtext');
    const mainContent = document.getElementById('main-content');

    setTimeout(() => hero?.classList.add('fade-in'),        160);
    setTimeout(() => heroContent?.classList.add('fade-in'), 1500);
    setTimeout(() => heroSubtext?.classList.add('fade-in'), 3350);
    setTimeout(() => mainContent?.classList.add('fade-in'), 1000);
  }

  // === ENDORSEMENTS CAROUSEL DRIVER ===
(() => {
  const wrap  = document.querySelector('#endorsementsCarousel');
  if (!wrap) return;

  const track = wrap.querySelector('.endorsements-track');
  const prev  = document.querySelector('.endorsements-btn.prev');
  const next  = document.querySelector('.endorsements-btn.next');
  if (!track || !prev || !next) return;

  // Compute how far to scroll (width of one card + flex gap)
  const stepPx = () => {
    const card = track.querySelector('.endorsement-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || getComputedStyle(track).columnGap || 0);
    return Math.round(card.getBoundingClientRect().width + gap);
  };

  const scrollByStep = (dir = 1) => {
    track.scrollBy({ left: dir * stepPx(), behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByStep(-1));
  next.addEventListener('click', () => scrollByStep(1));

  // Keyboard arrows when the carousel has focus
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByStep(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollByStep(-1); }
  });

  // Disable buttons at the ends for better UX
  const updateButtons = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= max;
  };

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  // Ensure smooth behavior even if CSS got changed
  track.style.scrollBehavior = 'smooth';

  updateButtons();
})();


  // -------- REVEAL ON SCROLL --------
  function initReveal() {
    // Auto-tag common blocks if they lack .reveal
    document.querySelectorAll('section, .container > .row, .card, .feature, .content-block')
      .forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, root: null, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  // -------- SHADOW ON SCROLL (pure cosmetics) --------
  function initShadow() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const toggleShadow = () => {
      if (window.scrollY > 8) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    document.addEventListener('scroll', toggleShadow, { passive: true });
    toggleShadow();
  }

  // -------- AUTO-HIDE NAVBAR (scroll/hover only) --------
  function initAutoHideNav() {
    const nav = document.querySelector('.auto-hide-navbar');
    if (!nav) return;

    // Avoid double-binding if partials re-run us.
    if (nav.dataset.autoHideInit === '1') return;
    nav.dataset.autoHideInit = '1';

    const HIDE_AFTER_IDLE_MS  = 700;
    const HIDE_AFTER_LEAVE_MS = 900;

    let activated = false; // becomes true after first *real* activity
    let menuOpen  = false; // Bootstrap collapse status
    let timer     = null;

    // Start hidden. (CSS default already hides, but this ensures no flash if HTML carried a show class.)
    nav.classList.remove('is-shown');

    const show = () => {
      if (menuOpen) return;              // keep visible while the mobile menu is open
      nav.classList.add('is-shown');
    };

    const hide = () => {
      if (menuOpen) return;
      if (nav.matches(':hover')) return; // don’t hide while actually hovered
      nav.classList.remove('is-shown');
    };

    const ping = (delay = HIDE_AFTER_IDLE_MS) => {
      // Don’t activate on synthetic initial scroll at y=0
      if (!activated && window.scrollY <= 2 && !nav.matches(':hover')) return;
      activated = true;
      show();
      clearTimeout(timer);
      timer = setTimeout(hide, delay);
    };

    // Real activity = scroll / wheel / touch / keydown
    ['scroll', 'wheel', 'touchmove', 'touchstart', 'keydown'].forEach((evtName) => {
      window.addEventListener(evtName, () => {
        // Guard the first scroll event if it's still at y=0
        if (!activated && evtName === 'scroll' && window.scrollY <= 2) return;
        ping(HIDE_AFTER_IDLE_MS);
      }, { passive: true });
    });

    // Hover guard (prevents “hover lock” after leaving)
    nav.addEventListener('mouseenter', () => { show(); clearTimeout(timer); });
    nav.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      timer = setTimeout(hide, HIDE_AFTER_LEAVE_MS);
    });

    // Integrate with Bootstrap collapse so it doesn’t hide while the menu is open
    const collapse = document.getElementById('primaryNav');
    if (collapse) {
      collapse.addEventListener('shown.bs.collapse', () => {
        menuOpen = true;
        nav.classList.add('is-shown');
        clearTimeout(timer);
      });
      collapse.addEventListener('hidden.bs.collapse', () => {
        menuOpen = false;
        // After closing, do a quick idle hide so it doesn’t stick open
        ping(200);
      });
    }
  }

  // ---- Run once DOM is parsed ----
  function boot() {
    initHero();
    initReveal();
    initShadow();
    initAutoHideNav(); // may be a no-op if nav not injected yet
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }



  // ---- Run again after partials inject the navbar ----
  const prev = window.afterPartialLoad;
  window.afterPartialLoad = function () {
    try { if (typeof prev === 'function') prev(); } catch (e) { /* ignore */ }
    // Re-bind only the pieces that depend on the injected nav
    initShadow();
    initAutoHideNav();
  };


})();
