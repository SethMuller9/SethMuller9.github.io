(function () {
  function include(el) {
    var src = el.getAttribute('data-include');
    if (!src) return;
    fetch(src, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        el.outerHTML = html;
        // If Bootstrap JS relies on data attributes, no further init is required.
        // If you need to re-run any custom nav code, you can do it here.
        if (typeof window.afterPartialLoad === 'function') window.afterPartialLoad();
      })
      .catch(function (err) {
        console.error('Include failed for', src, err);
      });
  }

  function init() {
    document.querySelectorAll('[data-include]').forEach(include);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// === Auto-hide navbar after 2.5s of no scrolling; show on scroll ===
(function(){ 
  var hideDelayMs = 1700;
  var timer = null;
  function getNavbar(){ return document.querySelector('.auto-hide-navbar'); }
  function show(){ 
    var nav = getNavbar(); 
    if (!nav) return; 
    nav.classList.remove('is-hidden'); 
    if (timer) clearTimeout(timer); 
    timer = setTimeout(function(){ hide(); }, hideDelayMs); 
  }
  function hide(){ 
    var nav = getNavbar(); 
    if (!nav) return; 
    nav.classList.add('is-hidden'); 
  }
  function bind(){
    show(); // start visible, then schedule hide
    var scheduled=false; window.addEventListener('scroll', function(){ if(!scheduled){ scheduled=true; requestAnimationFrame(function(){ show(); scheduled=false; }); }}, { passive: true });
  }
  var prior = window.afterPartialLoad;
  window.afterPartialLoad = function(){
    if (typeof prior === 'function') try { prior(); } catch(e){ console.warn(e); }
    bind();
  };
})();
// === End auto-hide navbar ===


// === set dynamic year in footer ===
(function(){
  function setYear(){
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }
  var prev = window.afterPartialLoad;
  window.afterPartialLoad = function(){
    if (typeof prev === 'function') try{ prev(); }catch(e){ console.warn(e); }
    setYear();
  };
})();
// === end dynamic year ===


// === Navbar hover lock: prevent autohide on hover ===
(function(){ 
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  onReady(function(){
    var nav = document.querySelector('.auto-hide-navbar');
    if(!nav) return;

    var HIDE_CLASSES = ['is-hidden','hidden'];
    function forceShow(){
      HIDE_CLASSES.forEach(function(c){ nav.classList.remove(c); });
      nav.style.opacity = '';
      nav.style.transform = '';
      nav.style.visibility = 'visible';
    }

    var hideTimers = [];
    var _setTimeout = window.setTimeout;
    var _clearTimeout = window.clearTimeout;
    window.setTimeout = function(fn, t){
      var id = _setTimeout(fn, t);
      hideTimers.push(id);
      return id;
    };
    window.clearTimeout = function(id){
      hideTimers = hideTimers.filter(function(x){ return x !== id; });
      return _clearTimeout(id);
    };

    function cancelHideTimers(){
      hideTimers.slice().forEach(function(id){ _clearTimeout(id); });
      hideTimers = [];
    }

    var hoverLock = false;
    nav.addEventListener('mouseenter', function(){
      hoverLock = true;
      cancelHideTimers();
      forceShow();
      nav.classList.add('hovering');
    }, {passive:true});

    nav.addEventListener('mouseleave', function(){
      hoverLock = false;
      nav.classList.remove('hovering');
    }, {passive:true});

    window.addEventListener('scroll', function(){
      if(hoverLock) forceShow();
    }, {passive:true});

    // Focus lock as well
    nav.addEventListener('focusin', function(){
      forceShow();
      nav.classList.add('hovering');
    });
    nav.addEventListener('focusout', function(e){
      if(!nav.contains(e.relatedTarget)){
        nav.classList.remove('hovering');
      }
    });
  });
})();
// === End navbar hover lock ===



// === Navbar init after partials (idempotent) ===
(function(){
  function setupNavbarLocks(){
    var nav = document.querySelector('.auto-hide-navbar');
    if(!nav || nav.dataset.navLocksInit === '1') return;
    nav.dataset.navLocksInit = '1';

    var HIDE_CLASSES = ['is-hidden','hidden'];
    function forceShow(){
      HIDE_CLASSES.forEach(function(c){ nav.classList.remove(c); });
      nav.style.opacity = '';
      nav.style.transform = '';
      nav.style.visibility = 'visible';
    }

    // Hover lock
    var hideTimers = [];
    var _setTimeout = window.setTimeout;
    var _clearTimeout = window.clearTimeout;
    function cancelHideTimers(){ hideTimers.slice().forEach(function(id){ _clearTimeout(id); }); hideTimers = []; }
    window.setTimeout = function(fn, t){ var id = _setTimeout(fn, t); hideTimers.push(id); return id; };
    window.clearTimeout = function(id){ hideTimers = hideTimers.filter(function(x){ return x !== id; }); return _clearTimeout(id); };

    var hoverLock = false;
    nav.addEventListener('mouseenter', function(){
      hoverLock = true;
      cancelHideTimers();
      forceShow();
      nav.classList.add('hovering');
    }, {passive:true});
    nav.addEventListener('mouseleave', function(){
      hoverLock = false;
      nav.classList.remove('hovering');
    }, {passive:true});
    window.addEventListener('scroll', function(){
      if(hoverLock) forceShow();
    }, {passive:true});

    // Focus lock
    nav.addEventListener('focusin', function(){
      forceShow();
      nav.classList.add('hovering');
    });
    nav.addEventListener('focusout', function(e){
      if(!nav.contains(e.relatedTarget)){
        nav.classList.remove('hovering');
      }
    });
  }

  // Chain with existing afterPartialLoad
  var prev = window.afterPartialLoad;
  window.afterPartialLoad = function(){
    if (typeof prev === 'function') { try { prev(); } catch(e) { console.warn(e); } }
    setupNavbarLocks();
  };

  // Also try at DOM ready (in case navbar is already in DOM)
  if (document.readyState !== 'loading') setupNavbarLocks();
  else document.addEventListener('DOMContentLoaded', setupNavbarLocks);
})();
// === End Navbar init after partials (idempotent) ===

