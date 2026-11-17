/* Extras: contact / email dropdowns with copy, shooting-star firework, real audio, comments that stay on the page. */
(function () {
  'use strict';
  var EMAILS = [
    { label: 'School', zh: '学校', addr: 'mwang0627@g.ucla.edu' },
    { label: 'Personal', zh: '个人', addr: 'mwang2428@gmail.com' }
  ];
  var MUSIC = [{ yt: 'iUj1pvSthhA' }, { yt: 'HRlW6yZo6Kc' }, { yt: 'TDVlDUAIz5k' }, { yt: 'um6VLQEm500' }, { yt: 'nQZKe9zla2U' }, { bili: 'BV1oa4y1v7oc' }];  // ChinaX, New Me, Heaven Can Wait, Decaffeinated, Ready To Fly, 旅途
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    html += '<div class="xscroll" aria-label="Look forward to talking to you ;)!">' +
      '<div class="xpaper"><p>Look forward to talking to you ;)!</p></div>' +
      '<span class="xrod l"></span><span class="xrod r"></span></div>';
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
  function burst(l, x, y, img, noPop) {
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
    if (noPop) return;
    var pop = document.createElement('img'); pop.src = img; pop.alt = ''; pop.className = 'xpop'; pop.style.left = x + 'px'; pop.style.top = y + 'px'; l.appendChild(pop);
    setTimeout(function () { pop.classList.add('out'); }, 2300);
    setTimeout(function () { pop.remove(); }, 3100);
  }
  function shoot(fromEl, imgSrc, targetEl, onLand) {
    var photo = document.querySelector('img[src*="c9c749fc2b8b3c077c100f783e415bb6"]');
    if (!photo) { if (onLand) onLand(); return; }
    var frame = photo.closest('div[style*="border-radius: 190px"]') || photo;
    var l = layer();
    var fr = fromEl.getBoundingClientRect(), pr = frame.getBoundingClientRect();
    var sx = fr.left + fr.width / 2 + window.scrollX, sy = fr.top + fr.height / 2 + window.scrollY;
    var tx, ty, side;
    if (targetEl) {
      var tr0 = targetEl.getBoundingClientRect();
      tx = tr0.left + tr0.width / 2 + window.scrollX; ty = tr0.top + tr0.height / 2 + window.scrollY;
      side = tx > pr.left + pr.width / 2 + window.scrollX ? 1 : -1;
    } else {
      side = Math.random() < 0.5 ? -1 : 1;
      tx = (side > 0 ? pr.right + 34 : pr.left - 34) + window.scrollX;
      ty = pr.top + window.scrollY + pr.height * (0.22 + Math.random() * 0.4);
    }
    window.scrollTo({ top: Math.max(0, ty - window.innerHeight / 2), behavior: 'smooth' });
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
      else { star.remove(); burst(l, tx, ty, imgSrc, !!targetEl); if (onLand) setTimeout(onLand, targetEl ? 250 : 0); }
    }
    requestAnimationFrame(step);
  }
  // Choosing a cursor only selects it. Clicking "Leave my mark" (with a name) sends the
  // shooting star to the visitor's new mark beside the photo, where their name appears.
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.querySelector || !form.querySelector('button.pick')) return;
    var nameIn = form.querySelector('input[type="text"]');
    if (!nameIn || !nameIn.value.trim()) return;
    var chosen = form.querySelector('button.pick[aria-pressed="true"]') || form.querySelector('button.pick');
    var img = chosen && chosen.querySelector('img');
    var from = form.querySelector('button[type="submit"]') || chosen;
    if (!img || reduce) return;
    var src = img.getAttribute('src');
    setTimeout(function () {                       // let the page add the new mark first
      var marks = document.querySelectorAll('.mark.mine');
      var target = marks[marks.length - 1];
      if (target) { target.style.visibility = 'hidden'; }
      shoot(from, src, target, function () { if (target) target.style.visibility = ''; });
    }, 0);
  }, true);

  /* ---------- music: official YouTube / Bilibili players inside the framed screen ---------- */
  var player = null, ytReady = false, ytLoading = false, curIdx = -1, pending = null, poll = null, musicInst = null, mode = null;
  function bar() { var m = document.getElementById('music'); return m && m.querySelector('.mbar'); }
  function screen() {
    var slot = document.querySelector('#music .xyt-slot'); if (!slot) return null;
    var h = slot.querySelector('.xyt-screen');
    if (!h) { h = document.createElement('div'); h.className = 'xyt-screen'; h.setAttribute('data-keep', ''); slot.appendChild(h); }
    return h;
  }
  function link(url, label) {
    var ls = document.querySelector('#music .xyt-linkslot'); if (!ls) return;
    var a = ls.querySelector('a');
    if (!a) { a = document.createElement('a'); a.className = 'xyt-link'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('data-keep', ''); ls.appendChild(a); }
    a.href = url; a.textContent = label;
  }
  function loadApi() {
    if (ytLoading) return; ytLoading = true;
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prev) prev(); ytReady = true; if (pending) { var p = pending; pending = null; window.SITE.music(p[0], p[1], p[2]); } };
    var sc = document.createElement('script'); sc.src = 'https://www.youtube.com/iframe_api';
    sc.onerror = function () { var h = screen(); if (h) h.innerHTML = '<p class="xaudio-note" style="padding:20px">The player couldn’t load — use the link beside the play button.</p>'; };
    document.head.appendChild(sc);
  }
  function startPoll() {
    clearInterval(poll);
    poll = setInterval(function () {
      if (mode !== 'yt' || !player || !player.getDuration) return;
      var d = player.getDuration(), t = player.getCurrentTime(), b = bar();
      if (b && d) b.style.width = (t / d * 100) + '%';
    }, 500);
  }
  function destroyYT() { if (player && player.destroy) { try { player.destroy(); } catch (e) {} } player = null; }
  window.SITE = window.SITE || {};
  window.SITE.music = function (inst, idx, play) {
    musicInst = inst;
    var h = screen(); if (!h) return;
    var src = MUSIC[idx];
    if (src.bili) {
      link('https://www.bilibili.com/video/' + src.bili, 'Open on Bilibili ↗');
      destroyYT(); mode = 'bili'; curIdx = idx;
      if (play) {
        h.classList.add('on');
        h.innerHTML = '<iframe src="https://player.bilibili.com/player.html?bvid=' + src.bili + '&autoplay=1&high_quality=1&danmaku=0" allow="autoplay; fullscreen; encrypted-media" allowfullscreen title="旅途 Journey — 自得琴社"></iframe>';
        var b = bar(); if (b) b.style.width = '0%';
      } else { h.innerHTML = ''; h.classList.remove('on'); }
      return;
    }
    link('https://www.youtube.com/watch?v=' + src.yt, 'Open on YouTube ↗');
    h.classList.add('on');
    if (!ytReady) { pending = [inst, idx, play]; loadApi(); return; }
    if (mode !== 'yt' || !player) {
      mode = 'yt'; curIdx = idx; destroyYT();
      h.innerHTML = '<div id="xyt-player"></div>';
      player = new YT.Player('xyt-player', {
        width: '100%', height: '100%', videoId: src.yt,
        playerVars: { autoplay: play ? 1 : 0, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: function (e) { if (play) e.target.playVideo(); startPoll(); },
          onStateChange: function (e) {
            if (e.data === 0) { var n = (curIdx + 1) % MUSIC.length; musicInst.setState({ idx: n, playing: true, pct: 0 }); window.SITE.music(musicInst, n, true); }
            else if (e.data === 1 && !musicInst.state.playing) musicInst.setState({ playing: true });
            else if (e.data === 2 && musicInst.state.playing) musicInst.setState({ playing: false });
          }
        }
      });
      return;
    }
    if (idx !== curIdx) { curIdx = idx; if (play) player.loadVideoById(src.yt); else player.cueVideoById(src.yt); return; }
    if (play) player.playVideo(); else player.pauseVideo();
  };

  /* ---------- comments on static forms: stay on the page, keep the name, survive reloads ---------- */
  function boxes() { return Array.prototype.filter.call(document.querySelectorAll('#comments, .cbox'), function (b) { var f = b.querySelector('form'); return f && !f.hasAttribute('data-dc-on'); }); }
  function storeKey(box) { return 'mw-notes:' + location.pathname.replace(/\/$/, '/index.html') + ':' + boxes().indexOf(box); }
  function loadNotes(box) { try { return JSON.parse(localStorage.getItem(storeKey(box)) || '[]'); } catch (e) { return []; } }
  function saveNotes(box, notes) { try { localStorage.setItem(storeKey(box), JSON.stringify(notes.slice(-60))); } catch (e) {} }
  function noteList(box) {
    var form = box.querySelector('form');
    return Array.prototype.filter.call(form.parentNode.children, function (c) { return c.tagName === 'DIV' && c.querySelector('.alias-wrap'); }).pop();
  }
  function addNote(box, who, text) {
    var list = noteList(box);
    var tpl = list && list.querySelector(':scope > div');
    if (!tpl) return;
    var item = tpl.cloneNode(true); item.setAttribute('data-keep', ''); item.style.marginTop = '0px';
    var tip = item.querySelector('.alias-tip'); if (tip) tip.textContent = who;
    var w = item.querySelector('.alias-wrap'); if (w) w.setAttribute('aria-label', 'Comment by ' + who);
    var p = item.querySelector('p'); if (p) p.textContent = text;
    list.insertBefore(item, list.firstChild);
  }
  document.addEventListener('submit', function (e) {
    var form = e.target;
    var box = form.closest('#comments, .cbox');
    if (!box || form.hasAttribute('data-dc-on')) return;
    e.preventDefault();
    var note = form.querySelector('input[type="text"]:not(.alias-in), textarea');
    var alias = form.querySelector('.alias-in');
    var text = note && note.value.trim(); if (!text) return;
    var who = (alias && alias.value.trim()) || 'a visitor';
    addNote(box, who, text);
    var notes = loadNotes(box); notes.push({ alias: who, text: text, at: Date.now() }); saveNotes(box, notes);
    note.value = ''; if (alias) alias.value = '';
  }, true);
  function restoreNotes() {
    boxes().forEach(function (box) {
      if (box.__restored) return; box.__restored = true;
      loadNotes(box).forEach(function (n) { addNote(box, n.alias, n.text); });
    });
  }

  /* ---------- comments pop up: as they scroll into view, and with a sparkle when a new one is left ---------- */
  var POP_IN = [
    { opacity: 0, transform: 'translateY(28px) scale(.5)', filter: 'drop-shadow(0 0 0 rgba(255,214,140,0))' },
    { opacity: 1, transform: 'translateY(-8px) scale(1.08)', filter: 'drop-shadow(0 0 14px rgba(255,214,140,.8))', offset: 0.6 },
    { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'drop-shadow(0 0 0 rgba(255,214,140,0))' }
  ];
  var POP_NEW = [
    { opacity: 0, transform: 'translateY(-30px) scale(.2) rotate(-8deg)' },
    { opacity: 1, transform: 'translateY(6px) scale(1.22) rotate(3deg)', offset: 0.55 },
    { opacity: 1, transform: 'translateY(-2px) scale(.95) rotate(-1deg)', offset: 0.8 },
    { opacity: 1, transform: 'none' }
  ];
  var popSeen = typeof WeakSet === 'function' ? new WeakSet() : null;
  var quietUntil = 0, popIO = null, popQueue = [], popTimer = null;
  function commentLists() {
    var out = [];
    Array.prototype.forEach.call(document.querySelectorAll('#comments, .cbox'), function (box) {
      var form = box.querySelector('form'); if (!form) return;
      var list = Array.prototype.filter.call(form.parentNode.children, function (c) { return c.tagName === 'DIV' && c.querySelector('.alias-wrap'); }).pop();
      if (list && out.indexOf(list) === -1) out.push(list);
    });
    return out;
  }
  function flushPops() {
    popTimer = null;
    popQueue.sort(function (a, b) { var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
    popQueue.forEach(function (el, i) { el.animate(POP_IN, { duration: 760, delay: i * 110, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }); });
    popQueue = [];
  }
  function scanComments() {
    if (!popSeen || reduce || !window.IntersectionObserver || !Element.prototype.animate) return;
    if (!popIO) popIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        popIO.unobserve(e.target);
        popQueue.push(e.target);
      });
      if (popQueue.length && !popTimer) popTimer = setTimeout(flushPops, 0);
    }, { threshold: 0.15 });
    var quiet = Date.now() < quietUntil;
    commentLists().forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (item) {
        if (popSeen.has(item)) return;
        popSeen.add(item);
        if (!quiet) popIO.observe(item);
      });
    });
  }
  // Read the note before the form handlers clear it, then pop the new comment once it is on the page.
  window.addEventListener('submit', function (e) {
    var box = e.target.closest && e.target.closest('#comments, .cbox');
    if (!box) return;
    var note = e.target.querySelector('input[type="text"]:not(.alias-in), textarea');
    if (!note || !note.value.trim()) return;
    quietUntil = Date.now() + 400;
    setTimeout(function () {
      scanComments();
      var list = commentLists().filter(function (l) { return box.contains(l); })[0];
      var item = list && list.firstElementChild;
      if (!item || reduce || !item.animate) return;
      item.animate(POP_NEW, { duration: 900, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' });
      setTimeout(function () {
        var icon = item.querySelector('.alias-wrap svg, .alias-wrap img') || item;
        var r = icon.getBoundingClientRect();
        burst(layer(), r.left + r.width / 2 + window.scrollX, r.top + r.height / 2 + window.scrollY, '', true);
      }, 420);
    }, 40);
  }, true);
  var scanPending = false;
  if (window.MutationObserver) new MutationObserver(function () { if (scanPending) return; scanPending = true; requestAnimationFrame(function () { scanPending = false; scanComments(); }); }).observe(document.documentElement, { childList: true, subtree: true });

  function ready() { addContactButton(); restoreNotes(); scanComments(); }
  window.addEventListener('DOMContentLoaded', ready);
  if (document.readyState !== 'loading') setTimeout(ready, 0);
})();
