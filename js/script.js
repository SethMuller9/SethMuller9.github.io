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

  // -------- AUTO-HIDE NAVBAR (thresholded, scroll-up reveal) --------
  function initAutoHideNav() {
    const nav = document.querySelector('.auto-hide-navbar');
    if (!nav) return;

    // Avoid double-binding if partials re-run us.
    if (nav.dataset.autoHideInit === '1') return;
    nav.dataset.autoHideInit = '1';

    // --- Tunables ---
    const HIDE_AFTER_IDLE_MS  = 1100;
    const HIDE_AFTER_LEAVE_MS = 1100;
    const ACTIVATION_Y        = 48;   // must be at least this far down page
    const SHOW_UP_DELTA       = 89;   // must scroll up this many px before showing
    const IGNORE_SMALL_DY     = 2;    // ignore micro scroll jitter

    let menuOpen    = false; // Bootstrap collapse status
    let timer       = null;
    let lastY       = window.scrollY;
    let upAccumPx   = 0;     // accumulated upward scroll since last reveal
    let initialized = false;

    // Start hidden (avoid flash if HTML had a class lingering)
    nav.classList.remove('is-shown');

    const show = () => {
      if (menuOpen) return;
      nav.classList.add('is-shown');
    };

    const hide = () => {
      if (menuOpen) return;
      if (nav.matches(':hover')) return; // don’t hide while actually hovered
      nav.classList.remove('is-shown');
    };

    const idleHideSoon = (delay = HIDE_AFTER_IDLE_MS) => {
      clearTimeout(timer);
      timer = setTimeout(hide, delay);
    };

    const maybeShowOnScroll = () => {
      const y  = window.scrollY;
      const dy = y - lastY;
      lastY    = y;

      // Ignore the synthetic first "scroll" at load and tiny jitters
      if (!initialized) { initialized = true; return; }
      if (Math.abs(dy) <= IGNORE_SMALL_DY) return;

      // 🆕 Special case: near the top, reveal nav when user scrolls UP
      if (y <= ACTIVATION_Y) {
        upAccumPx = 0; // reset accumulator
        if (dy < 0) {  // scrolling up toward/at the top
          show();
          idleHideSoon();
        }
        return;        // don't run the normal mid-page logic
      }

      if (dy > 0) {
        // Scrolling down -> reset upward accumulator; (optionally) hide sooner
        upAccumPx = 0;
        // If you want immediate hide on down-scroll, uncomment:
        // if (nav.classList.contains('is-shown')) hide();
      } else {
        // Scrolling up -> accumulate delta to decide if we should reveal
        upAccumPx += (-dy);
        if (upAccumPx >= SHOW_UP_DELTA) {
          show();
          idleHideSoon();   // start idle timer
          upAccumPx = 0;    // reset so we don’t spam show()
        }
      }
    };

    // Only scroll, wheel, and touchmove should influence visibility
    window.addEventListener('scroll',    maybeShowOnScroll, { passive: true });
    window.addEventListener('wheel',     maybeShowOnScroll, { passive: true });
    window.addEventListener('touchmove', maybeShowOnScroll, { passive: true });

    // Hover guard (prevents “hover lock” after leaving)
    nav.addEventListener('mouseenter', () => { show(); clearTimeout(timer); });
    nav.addEventListener('mouseleave', () => { idleHideSoon(HIDE_AFTER_LEAVE_MS); });

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
        idleHideSoon(200);
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
