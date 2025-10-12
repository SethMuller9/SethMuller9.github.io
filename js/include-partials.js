// === include partials (no navbar logic here) ===
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
        // allow other scripts to re-run after partial replacement
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


// === set dynamic year in footer ===
(function () {
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // run once now (for static footer)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setYear);
  } else {
    setYear();
  }

  // and again after any partial is inserted (for included footer)
  var prev = window.afterPartialLoad;
  window.afterPartialLoad = function () {
    if (typeof prev === 'function') {
      try { prev(); } catch (e) { console.warn(e); }
    }
    setYear();
  };


})();

