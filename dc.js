/* Tiny template runtime for Michelle's site.
   Renders <template data-dc="Name"> blocks with {{holes}}, <sc-for>, <sc-if> and <dc-import>,
   and re-renders (with a light DOM morph) whenever a component calls setState. */
(function () {
  'use strict';
  var classes = {};
  var EVENT_MAP = { change: 'input' };

  function DCLogic(props) { this.props = props || {}; this.state = this.state || {}; }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, next);
    if (this.__onState) this.__onState(this.state);
    if (this.__rerender) this.__rerender();
  };
  window.DCLogic = DCLogic;

  function lookup(scope, path) {
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function evalExpr(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (/^[\w$]+(\.[\w$]+)*$/.test(expr)) return lookup(scope, expr);
    try { return new Function('s', 'with (s) { return (' + expr + '); }')(scope); } catch (e) { return undefined; }
  }
  var HOLE = /\{\{([\s\S]+?)\}\}/g;
  function interp(str, scope) {
    return str.replace(HOLE, function (_, e) { var v = evalExpr(e, scope); return v == null ? '' : String(v); });
  }
  function single(str) { var m = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(str); return m ? m[1] : null; }

  function processChildren(parent, scope) {
    var kids = Array.prototype.slice.call(parent.childNodes);
    for (var i = 0; i < kids.length; i++) processNode(kids[i], scope);
  }
  function unwrap(el) { var p = el.parentNode; while (el.firstChild) p.insertBefore(el.firstChild, el); p.removeChild(el); }

  function processNode(node, scope) {
    if (node.nodeType === 3) { if (node.nodeValue.indexOf('{{') !== -1) node.nodeValue = interp(node.nodeValue, scope); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'sc-for') {
      var list = evalExpr(single(node.getAttribute('list')) || 'null', scope) || [];
      var as = node.getAttribute('as') || 'item';
      var tpl = Array.prototype.slice.call(node.childNodes);
      var parent = node.parentNode;
      list.forEach(function (item, idx) {
        var sub = Object.create(scope); sub[as] = item; sub.$index = idx;
        var frag = document.createDocumentFragment();
        tpl.forEach(function (c) { frag.appendChild(c.cloneNode(true)); });
        processChildren(frag, sub);
        parent.insertBefore(frag, node);
      });
      parent.removeChild(node);
      return;
    }
    if (tag === 'sc-if') {
      var ok = evalExpr(single(node.getAttribute('value')) || 'false', scope);
      if (ok) { processChildren(node, scope); unwrap(node); } else node.parentNode.removeChild(node);
      return;
    }
    if (tag === 'dc-import') {
      var name = node.getAttribute('name'), props = {};
      Array.prototype.slice.call(node.attributes).forEach(function (a) {
        if (a.name === 'name' || a.name.indexOf('hint-') === 0) return;
        var s = single(a.value); props[a.name] = s ? evalExpr(s, scope) : interp(a.value, scope);
      });
      var wrap = document.createElement('div');
      wrap.className = 'dc-' + name; wrap.style.display = 'contents';
      wrap.appendChild(render(name, new classes[name](props)));
      node.parentNode.replaceChild(wrap, node);
      return;
    }
    Array.prototype.slice.call(node.attributes).forEach(function (a) {
      if (a.name.indexOf('hint-') === 0) { node.removeAttribute(a.name); return; }
      if (a.value.indexOf('{{') === -1) return;
      var s = single(a.value);
      if (/^on[a-z]+$/.test(a.name)) {
        var ev = a.name.slice(2); ev = EVENT_MAP[ev] || ev;
        node.__dcHandlers = node.__dcHandlers || {};
        node.__dcHandlers[ev] = s ? evalExpr(s, scope) : null;
        node.removeAttribute(a.name);
        node.setAttribute('data-dc-on', Object.keys(node.__dcHandlers).join(' '));
        return;
      }
      var v = s ? evalExpr(s, scope) : interp(a.value, scope);
      node.setAttribute(a.name, v == null ? '' : String(v));
    });
    if (tag !== 'template' && tag !== 'script' && tag !== 'style') processChildren(node, scope);
  }

  function render(name, inst) {
    var tpl = document.querySelector('template[data-dc="' + name + '"]');
    var frag = tpl.content.cloneNode(true);
    processChildren(frag, inst.renderVals() || {});
    return frag;
  }

  function bindEvents(root) {
    var els = root.querySelectorAll ? root.querySelectorAll('[data-dc-on]') : [];
    Array.prototype.forEach.call(els, function (el) {
      el.__dcBound = el.__dcBound || {};
      Object.keys(el.__dcHandlers || {}).forEach(function (ev) {
        if (el.__dcBound[ev]) return;
        el.__dcBound[ev] = true;
        el.addEventListener(ev, function (e) { var h = el.__dcHandlers && el.__dcHandlers[ev]; if (typeof h === 'function') h(e); });
      });
    });
  }

  function syncAttrs(a, b) {
    Array.prototype.slice.call(a.attributes).forEach(function (at) { if (!b.hasAttribute(at.name)) a.removeAttribute(at.name); });
    Array.prototype.slice.call(b.attributes).forEach(function (at) { if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value); });
    if ((a.localName === 'input' || a.localName === 'textarea') && b.hasAttribute('value') && a.value !== b.getAttribute('value')) a.value = b.getAttribute('value');
    a.__dcHandlers = b.__dcHandlers;
  }
  function morph(oldP, newP) {
    var oldKids = Array.prototype.filter.call(oldP.childNodes, function (n) { return !(n.nodeType === 1 && n.hasAttribute('data-keep')); });
    var newKids = Array.prototype.slice.call(newP.childNodes);
    for (var i = 0; i < newKids.length; i++) {
      var o = oldKids[i], n = newKids[i];
      if (!o) { oldP.appendChild(n); continue; }
      if (o.nodeType !== n.nodeType || (o.nodeType === 1 && o.localName !== n.localName)) { oldP.replaceChild(n, o); continue; }
      if (o.nodeType === 3 || o.nodeType === 8) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; continue; }
      syncAttrs(o, n);
      if (o.localName !== 'video') morph(o, n);
    }
    for (var j = newKids.length; j < oldKids.length; j++) oldP.removeChild(oldKids[j]);
  }

  window.DC = {
    define: function (name, cls) { classes[name] = cls; },
    mount: function (name, props, el, opts) {
      var inst = new classes[name](props || {});
      opts = opts || {};
      if (opts.restore) { try { var saved = JSON.parse(localStorage.getItem(opts.restore) || 'null'); if (saved) inst.state = Object.assign({}, inst.state, saved); } catch (e) {} }
      if (opts.restore) inst.__onState = function (st) { try { localStorage.setItem(opts.restore, JSON.stringify(st)); } catch (e) {} };
      el.appendChild(render(name, inst));
      bindEvents(el);
      inst.__rerender = function () { var holder = document.createElement('div'); holder.appendChild(render(name, inst)); morph(el, holder); bindEvents(el); };
      return inst;
    }
  };
})();
