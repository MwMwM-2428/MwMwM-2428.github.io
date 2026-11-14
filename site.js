/* Site behaviour: opening screen, butterfly-free scroll transitions, comment delivery. */
(function () {
  'use strict';
  var EMAIL = 'mwang2428@gmail.com';
  var PAGE_NAMES = { Main: 'Home', Education: 'Education', Projects: 'Projects', Research: 'Research', Life: 'Life' };

  function fitCover(box) {
    var s = Math.max(window.innerWidth / 1440, window.innerHeight / 900);
    box.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
  }
  function fitContain(box) {
    var s = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
    s = Math.max(s, Math.min(window.innerWidth / 1100, 1));
    box.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
  }

  function seen(key) { try { return sessionStorage.getItem(key) === '1'; } catch (e) { return false; } }
  function markSeen(key) { try { sessionStorage.setItem(key, '1'); } catch (e) {} }

  var SITE = {
    transition: function (name) {
      var wrap = document.getElementById('transition');
      var root = document.getElementById('transition-root');
      if (!wrap || !root) return;
      var key = 'mw-opened-' + name;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (seen(key) || reduce) { wrap.parentNode.removeChild(wrap); return; }
      markSeen(key);
      DC.mount('__Transition', {}, root);
      var fit = function () { fitCover(root); };
      fit(); window.addEventListener('resize', fit);
      document.documentElement.style.overflow = 'hidden';
      var closed = false;
      function close() {
        if (closed) return; closed = true;
        wrap.classList.add('done');
        document.documentElement.style.overflow = '';
        setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); window.removeEventListener('resize', fit); }, 750);
      }
      wrap.addEventListener('click', close);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') close(); }, { once: true });
      setTimeout(close, 4700);
    },

    init: function (name) {
      if (name === 'Opening') {
        var stage = document.getElementById('opening-stage');
        var box = document.getElementById('dc-root');
        var fit = function () {
          if (window.innerWidth / window.innerHeight >= 1.2) return fitCover(box);
          var s = window.innerWidth / 1120;  // portrait screens: fit the whole scroll across the width
          box.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
        };
        fit(); window.addEventListener('resize', fit);
        var go = function () { window.location.href = 'home.html'; };
        stage.addEventListener('click', go);
        document.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(); });
        stage.setAttribute('role', 'link'); stage.setAttribute('tabindex', '0'); stage.setAttribute('aria-label', 'Enter Michelle Wang’s website');
        return;
      }
      // Comments: deliver each note to Michelle by email, and thank the visitor on the page.
      var pageLabel = PAGE_NAMES[name] || name;
      function deliver(form, text) {
        var subject = 'A note from your website (' + pageLabel + ')';
        var aliasEl = form.querySelector('.alias-in');
        var who = aliasEl && aliasEl.value.trim();
        var body = (who ? 'From: ' + who + '\n\n' : '') + text;
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        var thanks = form.parentNode.querySelector('.local-thanks');
        if (!thanks) {
          thanks = document.createElement('p');
          thanks.className = 'local-thanks'; thanks.setAttribute('data-keep', '');
          form.parentNode.insertBefore(thanks, form.nextSibling);
        }
        thanks.textContent = 'Thank you ✦ Your email app should open with your note to Michelle — just press send.';
      }
      document.addEventListener('submit', function (e) {
        var form = e.target;
        var input = form.querySelector('input[type="text"]:not(.alias-in), textarea');
        if (!input) return;
        if (!form.closest('#comments, .cbox')) return;
        var text = (input.value || '').trim();
        if (!form.hasAttribute('data-dc-on')) e.preventDefault();
        if (text) deliver(form, text);
      }, true);
      // Static comment forms use type="button" — make Enter and the button submit them.
      Array.prototype.forEach.call(document.querySelectorAll('#comments form, .cbox form'), function (form) {
        if (form.hasAttribute('data-dc-on')) return;
        var btn = form.querySelector('button');
        if (btn) btn.addEventListener('click', function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); });
      });
    }
  };
  window.SITE = SITE;
})();
