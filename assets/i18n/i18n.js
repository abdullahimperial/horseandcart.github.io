/* English is the source language. Urdu copy is edited against the author's Urdu manuscript. */
(function (root) {
  'use strict';
  const doc = root.document;
  const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const escapeRE = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const copy = root.LFM_UR || {};
  const catalog = new Map(Object.entries(copy).map(([en, ur]) => [normalize(en), ur]));
  const patterns = [];
  for (const [source, target] of catalog) {
    if (!/\{\{\d+\}\}/.test(source)) continue;
    const ids = [], parts = source.split(/(\{\{\d+\}\})/g);
    const literalLength = source.replace(/\{\{\d+\}\}/g, '').length;
    if (literalLength < 3) continue;
    const expression = parts.map(part => {
      const match = part.match(/^\{\{(\d+)\}\}$/);
      if (!match) return escapeRE(part);
      ids.push(match[1]); return '([\\s\\S]*?)';
    }).join('');
    patterns.push({ regex: new RegExp('^' + expression + '$'), ids, target, literalLength });
  }
  patterns.sort((a, b) => b.literalLength - a.literalLength);
  let language = 'en';
  const explicit = new URL(root.location.href).searchParams.get('lang');
  let remembered = null;
  try {
    remembered = root.localStorage.getItem('lfm-language');
    if (explicit === 'en' || explicit === 'ur') root.localStorage.setItem('lfm-language', explicit);
  } catch (_) { /* A blocked preference store must not block the website. */ }
  language = ['en', 'ur'].includes(explicit) ? explicit : remembered === 'ur' ? 'ur' : 'en';
  function translate(value, depth = 0) {
    const original = String(value ?? '');
    if (language !== 'ur' || !/[A-Za-z]/.test(original)) return original;
    const key = normalize(original);
    if (catalog.has(key)) return catalog.get(key);
    if (depth < 3) {
      const affix = key.match(/^([/\[\]0-9\s·:()]*)([A-Za-z][\s\S]*?)([\s:()→←↗↖]*)$/);
      if (affix && (affix[1] || affix[3]) && affix[2] !== key) {
        const body = translate(affix[2], depth + 1);
        if (body !== affix[2]) return affix[1] + body + affix[3];
      }
    }
    if (depth < 3 && key.length < 6000) {
      for (const pattern of patterns) {
        const match = key.match(pattern.regex);
        if (!match) continue;
        const values = {};
        pattern.ids.forEach((id, i) => { values[id] = translate(match[i + 1], depth + 1); });
        return pattern.target.replace(/\{\{(\d+)\}\}/g, (all, id) => values[id] ?? all);
      }
      // Renderers sometimes join several separately authored messages.
      const sentences = original.split(/(?<=[.!?])\s+(?=[A-Z])|\n/);
      if (sentences.length > 1) {
        const translated = sentences.map(sentence => translate(sentence, depth + 1));
        if (translated.some((sentence, i) => sentence !== sentences[i])) return translated.join(' ');
      }
    }
    return original;
  }
  const API = {
    get lang() { return language; },
    t: translate,
    source: node => !node ? undefined : node.nodeType === 3 ? (sources.get(node)?.source ?? node.nodeValue) : [...node.childNodes].map(child => API.source(child)).join(''),
    refresh: () => { if (mounted) { observer.disconnect(); walk(doc.documentElement); observe(); } },
    setLanguage,
    // Search labels can be matched in the selected language without changing stored values.
    searchText: value => normalize(String(value) + ' ' + translate(value)).toLocaleLowerCase(),
    ready: null
  };
  root.LFM = API;
  if (!doc) return;
  function setDirection() {
    doc.documentElement.lang = language;
    doc.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    doc.documentElement.dataset.siteLanguage = language;
  }
  setDirection();
  const sources = new WeakMap(), attributes = new WeakMap(), linkSources = new WeakMap();
  const skip = 'script,style,code,pre,[contenteditable="true"],[translate="no"],[data-lfm-private],#site-language';
  const attributeNames = ['title', 'placeholder', 'aria-label', 'aria-valuetext', 'alt'];
  let observer, pending = new Set(), frame = 0, mounted = false;
  function applyText(node) {
    if (!node.parentElement || node.parentElement.closest(skip + ',textarea')) return;
    if (node.parentElement.matches('option') && !node.parentElement.hasAttribute('value')) node.parentElement.setAttribute('value', node.parentElement.value);
    const current = node.nodeValue;
    let record = sources.get(node);
    if (!record || current !== record.output) record = { source: current, output: current };
    const translated = translate(record.source);
    const whitespace = record.source.match(/^(\s*)[\s\S]*?(\s*)$/);
    const next = translated === record.source ? record.source : whitespace[1] + translated + whitespace[2];
    record.output = next; sources.set(node, record);
    if (node.nodeValue !== next) node.nodeValue = next;
  }
  function applyAttributes(element) {
    if (element.closest(skip)) return;
    const names = element.matches('meta[name="description"],meta[property="og:title"],meta[property="og:description"]') ? [...attributeNames, 'content'] : attributeNames;
    let records = attributes.get(element);
    if (!records) { records = {}; attributes.set(element, records); }
    for (const name of names) {
      const current = element.getAttribute(name);
      if (current === null) continue;
      let record = records[name];
      if (!record || current !== record.output) record = { source: current, output: current };
      const next = translate(record.source);
      record.output = next; records[name] = record;
      if (current !== next) element.setAttribute(name, next);
    }
    if (element.matches('a[href]')) updateLink(element);
  }
  function updateLink(element) {
    if (element.closest('#site-language') || element.hasAttribute('download')) return;
    const current = element.getAttribute('href');
    let record = linkSources.get(element);
    if (!record || current !== record.output) record = { source: current, output: current };
    if (!record.source || record.source.startsWith('#')) return;
    try {
      const url = new URL(record.source, root.location.href);
      if (url.origin !== root.location.origin || !/^https?:$/.test(url.protocol)) return;
      if (!url.pathname.endsWith('/') && !/\.html?$/.test(url.pathname)) return;
      if (language === 'ur') url.searchParams.set('lang', 'ur');
      else url.searchParams.delete('lang');
      record.output = url.pathname + url.search + url.hash;
      linkSources.set(element, record);
      if (current !== record.output) element.setAttribute('href', record.output);
    } catch (_) { /* Preserve a link if it is not a normal website destination. */ }
  }
  function walk(scope) {
    if (!scope || !scope.isConnected) return;
    if (scope.nodeType === 3) { applyText(scope); return; }
    if (scope.nodeType !== 1 && scope.nodeType !== 9) return;
    if (scope.nodeType === 1 && scope.closest(skip)) return;
    if (scope.nodeType === 1) applyAttributes(scope);
    const walker = doc.createTreeWalker(scope, root.NodeFilter.SHOW_ELEMENT | root.NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.nodeType === 1 && node.matches(skip) ? root.NodeFilter.FILTER_REJECT : root.NodeFilter.FILTER_ACCEPT
    });
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) applyText(node); else applyAttributes(node);
    }
  }
  function observe() {
    observer?.observe(doc.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...attributeNames, 'href', 'content'] });
  }
  function flush() {
    frame = 0; observer?.disconnect();
    const scopes = [...pending]; pending.clear();
    for (const scope of scopes) walk(scope);
    observe();
  }
  function schedule(scope) {
    if (scope) pending.add(scope);
    if (!frame) frame = root.requestAnimationFrame(flush);
  }
  function refreshControl() {
    const bar = doc.getElementById('site-language');
    if (!bar) return;
    bar.querySelectorAll('[data-language]').forEach(link => {
      const value = link.dataset.language;
      const url = new URL(root.location.href); url.searchParams.set('lang', value);
      link.href = url.pathname + url.search + url.hash;
      link.setAttribute('aria-current', value === language ? 'true' : 'false');
    });
  }
  function setLanguage(value, updateHistory = true) {
    if (value !== 'en' && value !== 'ur') return;
    language = value; setDirection();
    try { root.localStorage.setItem('lfm-language', value); } catch (_) {}
    if (updateHistory) {
      const url = new URL(root.location.href); url.searchParams.set('lang', value);
      root.history.replaceState(root.history.state, '', url.pathname + url.search + url.hash);
    }
    if (mounted) {
      observer.disconnect(); walk(doc.documentElement); refreshControl(); observe();
      root.dispatchEvent(new root.CustomEvent('lfmlanguagechange', { detail: { language } }));
      const status = doc.getElementById('site-language-status');
      status.textContent = language === 'ur' ? 'ویب سائٹ کی زبان اردو ہے۔' : 'Website language is English.';
    }
  }
  function mount() {
    if (mounted) return; mounted = true;
    const bar = doc.createElement('nav');
    bar.id = 'site-language'; bar.className = 'site-language'; bar.dir = 'ltr'; bar.setAttribute('aria-label', 'Website language / ویب سائٹ کی زبان');
    bar.innerHTML = '<div class="site-language-inner"><span class="site-language-label">Language <span lang="ur">/ زبان</span></span><div class="site-language-options"><a href="?lang=en" data-language="en" lang="en" hreflang="en">English</a><a href="?lang=ur" data-language="ur" lang="ur" hreflang="ur" dir="rtl">اردو</a></div><span id="site-language-status" class="language-sr-only" aria-live="polite"></span></div>';
    doc.body.prepend(bar);
    bar.addEventListener('click', event => {
      const link = event.target.closest('[data-language]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); setLanguage(link.dataset.language);
    });
    refreshControl(); walk(doc.documentElement);
    observer = new root.MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') mutation.addedNodes.forEach(schedule);
        else schedule(mutation.target);
      }
    });
    observe();
    doc.documentElement.classList.add('lfm-i18n-ready');
    API.ready = Promise.resolve();
  }
  root.addEventListener('popstate', () => {
    const selected = new URL(root.location.href).searchParams.get('lang');
    if (selected === 'en' || selected === 'ur') setLanguage(selected, false);
  });
  // Browser dialogs are authored UI too. User-entered form values are never changed.
  for (const name of ['alert', 'confirm']) {
    if (typeof root[name] !== 'function') continue;
    const native = root[name].bind(root);
    root[name] = message => native(translate(message));
  }
  const nativePrint = typeof root.print === 'function' ? root.print.bind(root) : null;
  if (nativePrint) root.print = () => { API.refresh(); nativePrint(); };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount); else mount();
})(typeof window === 'undefined' ? globalThis : window);
