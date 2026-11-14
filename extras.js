/* Extras: contact / email dropdowns with copy, shooting-star firework, real audio, comment aliases. */
(function () {
  'use strict';
  var EMAILS = [
    { label: 'School', zh: '学校', addr: 'mwang0627@g.ucla.edu' },
    { label: 'Personal', zh: '个人', addr: 'mwang2428@gmail.com' }
  ];
  var MUSIC = ['assets/music/chinax.mp3', 'assets/music/new-me.mp3', 'assets/music/die-for-you.mp3'];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BFLY = '<svg viewBox="0 0 60 48" aria-hidden="true"><g class="xflap"><path d="M30 24 C24 8 8 2 5 10 C2 18 14 24 30 24Z"/><path d="M30 24 C36 8 52 2 55 10 C58 18 46 24 30 24Z"/><path d="M30 24 C24 28 14 38 18 42 C22 45 28 36 30 24Z"/><path d="M30 24 C36 28 46 38 42 42 C38 45 32 36 30 24Z"/></g><path class="xbody" d="M30 17 L30 32"/></svg>';

  /* ---------- copy to clipboard ---------- */
  function copy(text, btn) {
    var done = function () { var old = btn.getAttribute('data-label'); btn.textContent = 'Copied ✓ 已复制'; btn.classList.add('ok'); setTimeout(function () { btn.textContent = old; btn.classList.remove('ok'); }, 1600); };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, fallback); } else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t); done(); }
  }

  /* ---------- dropdown panels ---------- */
  var openPanel = null, openAnchor = null;
  function closePanel() { if (openPanel) { openPanel.remove(); openPanel = null; if (openAnchor) openAnchor.setAttribute('aria-expanded', 'false'); openAnchor = null; } }
  function buildPanel(kind) {
    var p = document.createElement('div');
    p.className = 'xpanel' + (kind === 'contact' ? ' xcontact' : '');
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', kind === 'contact' ? 'Contact Michelle' : 'Michelle’s email addresses');
    var html = '<div class="xhead">' + (kind === 'contact' ? 'CONTACT ME · 联系我' : 'EMAIL · 邮箱') + '</div>';
    EMAILS.forEach(function (e) {
      html += '<div class="xrow"><span class="xlab">' + e.label + ' · ' + e.zh + '</span>' +
        '<a class="xaddr" href="mailto:' + e.addr + '">' + e.addr + '</a>' +
        '<button type="button" class="xcopy" data-copy="' + e.addr + '" data-label="Click to copy to clipboard">Click to copy to clipboard</button></div>';
    });
    if (kind === 'contact') {
      html += '<div class="xnote"><span class="xthread l"></span><span class="xthread r"></span>' +
        '<span class="xbf l">' + BFLY + '</span><span class="xbf r">' + BFLY + '</span>' +
        '<p>Look forward to talking to you ;)!</p></div>';
    }
    p.innerHTML = html;
    p.addEventListener('click', function (ev) { var b = ev.target.closest('.xcopy'); if (b) copy(b.getAttribute('data-copy'), b); });
    return p;
  }
  function togglePanel(anchor, kind) {
    if (openAnchor === anchor) { closePanel(); return; }
    closePanel();
    var p = buildPanel(kind);
    document.body.appendChild(p);
    var r = anchor.getBoundingClientRect();
    var w = p.offsetWidth;
    var left = Math.min(Math.max(12, r.left + window.scrollX + r.width / 2 - w / 2), window.scrollX + document.documentElement.clientWidth - w - 12);
    p.style.left = left + 'px';
    p.style.top = (r.bottom + window.scrollY + 10) + 'px';
    openPanel = p; openAnchor = anchor; anchor.setAttribute('aria-expanded', 'true');
    var first = p.querySelector('.xcopy'); if (first) first.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-dd]');
    if (a) { e.preventDefault(); togglePanel(a, a.getAttribute('data-dd')); return; }
    if (openPanel && !e.target.closest('.xpanel')) closePanel();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
  window.addEventListener('resize', closePanel);

  function addContactButton() {
    var header = document.querySelector('#dc-root header');
    if (!header || header.querySelector('[data-dd="contact"]')) return;
    var btn = document.createElement('a');
    btn.href = 'mailto:mwang2428@gmail.com';
    btn.setAttribute('data-dd', 'contact'); btn.setAttribute('data-keep', ''); btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
    btn.className = 'xcontact-btn';
    btn.innerHTML = 'Contact me <span aria-hidden="true">▾</span>';
    var resume = header.querySelector('a[download]');
    if (resume) resume.parentNode.insertBefore(btn, resume.nextSibling);
    else header.appendChild(btn);
  }

  /* ---------- shooting star → firework beside the photo ---------- */
  function layer() {
    var l = document.getElementById('xfx');
    if (!l) { l = document.createElement('div'); l.id = 'xfx'; document.body.appendChild(l); }
    l.style.height = document.documentElement.scrollHeight + 'px';
    return l;
  }
  function burst(l, x, y, img) {
    var colors = ['#fff6dc', '#f3dca6', '#e7c77f', '#c9b8ff', '#9d8cf0'];
    for (var i = 0; i < 30; i++) {
      var d = document.createElement('span');
      d.className = 'xspark';
      var a = (i / 30) * Math.PI * 2 + Math.random() * 0.3, dist = 45 + Math.random() * 75;
      d.style.left = x + 'px'; d.style.top = y + 'px';
      d.style.background = d.style.color = colors[i % colors.length];
      d.style.setProperty('--tx', Math.cos(a) * dist + 'px');
      d.style.setProperty('--ty', (Math.sin(a) * dist + 26) + 'px');
      l.appendChild(d);
      setTimeout(function (el) { el.remove(); }.bind(null, d), 1300);
    }
    var ring = document.createElement('span'); ring.className = 'xring'; ring.style.left = x + 'px'; ring.style.top = y + 'px'; l.appendChild(ring);
    setTimeout(function () { ring.remove(); }, 900);
    var pop = document.createElement('img'); pop.src = img; pop.alt = ''; pop.className = 'xpop'; pop.style.left = x + 'px'; pop.style.top = y + 'px'; l.appendChild(pop);
    setTimeout(function () { pop.classList.add('out'); }, 2300);
    setTimeout(function () { pop.remove(); }, 3100);
  }
  function shoot(fromEl, imgSrc) {
    var photo = document.querySelector('img[src*="c9c749fc2b8b3c077c100f783e415bb6"]');
    if (!photo) return;
    var frame = photo.closest('div[style*="border-radius: 190px"]') || photo;
    var l = layer();
    var fr = fromEl.getBoundingClientRect(), pr = frame.getBoundingClientRect();
    var sx = fr.left + fr.width / 2 + window.scrollX, sy = fr.top + fr.height / 2 + window.scrollY;
    var side = Math.random() < 0.5 ? -1 : 1;
    var tx = (side > 0 ? pr.right + 34 : pr.left - 34) + window.scrollX;
    var ty = pr.top + window.scrollY + pr.height * (0.22 + Math.random() * 0.4);
    if (pr.top < 0 || pr.bottom > window.innerHeight) window.scrollTo({ top: Math.max(0, ty - window.innerHeight / 2), behavior: 'smooth' });
    var star = document.createElement('div'); star.className = 'xstar';
    star.innerHTML = '<img src="' + imgSrc + '" alt=""><span class="xcore"></span>';
    l.appendChild(star);
    var cx = (sx + tx) / 2 + side * 160, cy = Math.min(sy, ty) - 220;
    var T = 1250, t0 = performance.now(), lastTrail = 0;
    function step(now) {
      var k = Math.min(1, (now - t0) / T), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      var x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * tx;
      var y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * ty;
      star.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      star.classList.toggle('lit', k > 0.12);
      if (now - lastTrail > 16) {
        lastTrail = now;
        var tr = document.createElement('span'); tr.className = 'xtrail';
        tr.style.left = x + 'px'; tr.style.top = y + 'px'; l.appendChild(tr);
        setTimeout(function (el) { el.remove(); }.bind(null, tr), 700);
      }
      if (k < 1) requestAnimationFrame(step);
      else { star.remove(); burst(l, tx, ty, imgSrc); }
    }
    requestAnimationFrame(step);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button.pick');
    if (!b || reduce) return;
    var img = b.querySelector('img');
    if (img) shoot(b, img.getAttribute('src'));
  }, true);

  /* ---------- music ---------- */
  var audio = null, curIdx = -1;
  function bar() { var m = document.getElementById('music'); return m && m.querySelector('span[style*="height: 3px"]'); }
  window.SITE = window.SITE || {};
  window.SITE.music = function (inst, idx, play) {
    if (!audio) {
      audio = new Audio(); audio.preload = 'none';
      audio.addEventListener('timeupdate', function () { var b = bar(); if (b && audio.duration) b.style.width = (audio.currentTime / audio.duration * 100) + '%'; });
      audio.addEventListener('ended', function () { var n = (curIdx + 1) % MUSIC.length; inst.setState({ idx: n, playing: true }); window.SITE.music(inst, n, true); });
      audio.addEventListener('error', function () {
        inst.setState({ playing: false });
        var m = document.getElementById('music'); if (!m || m.querySelector('.xaudio-note')) return;
        var p = document.createElement('p'); p.className = 'xaudio-note'; p.setAttribute('data-keep', ''); p.textContent = 'This song isn’t uploaded yet — check back soon ♪';
        m.appendChild(p);
      });
    }
    if (idx !== curIdx) { audio.src = MUSIC[idx]; curIdx = idx; }
    if (play) { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); } else audio.pause();
  };

  /* ---------- comment aliases (static comment forms) ---------- */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.closest('#comments, .cbox') || form.hasAttribute('data-dc-on')) return;
    var note = form.querySelector('input:not(.alias-in)');
    var alias = form.querySelector('.alias-in');
    var text = note && note.value.trim(); if (!text) return;
    var who = (alias && alias.value.trim()) || 'a visitor';
    var box = form.parentNode;
    var list = Array.prototype.filter.call(box.children, function (c) { return c.tagName === 'DIV' && c.querySelector('.alias-wrap'); }).pop();
    var tpl = list && list.querySelector(':scope > div');
    if (tpl) {
      var item = tpl.cloneNode(true); item.setAttribute('data-keep', ''); item.style.marginTop = '0px';
      var tip = item.querySelector('.alias-tip'); if (tip) tip.textContent = who;
      var w = item.querySelector('.alias-wrap'); if (w) w.setAttribute('aria-label', 'Comment by ' + who);
      var p = item.querySelector('p'); if (p) p.textContent = text;
      list.insertBefore(item, list.firstChild);
    }
    setTimeout(function () { note.value = ''; if (alias) alias.value = ''; }, 0);
  }, true);

  window.addEventListener('DOMContentLoaded', addContactButton);
  if (document.readyState !== 'loading') addContactButton();
})();
