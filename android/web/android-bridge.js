/* Android-only adapter. Financial calculations remain in the shared web app. */
(() => {
  'use strict';
  if (!window.MoneySnapshotAndroid) return;
  const bridge = window.MoneySnapshotAndroid;
  const MAX_BYTES = 8 * 1024 * 1024;
  const blobs = new Map();
  const createURL = URL.createObjectURL.bind(URL);
  const revokeURL = URL.revokeObjectURL.bind(URL);
  const click = HTMLAnchorElement.prototype.click;
  function status(message) {
    let node = document.getElementById('android-status');
    if (!node) {
      node = document.createElement('p');
      node.id = 'android-status'; node.setAttribute('role', 'status');
      document.body.prepend(node);
    }
    node.textContent = message;
  }
  addEventListener('money-snapshot-native-status', event => status(String(event.detail)));
  function send(request) { bridge.postMessage(JSON.stringify(request)); }
  URL.createObjectURL = blob => { const url = createURL(blob); blobs.set(url, blob); return url; };
  URL.revokeObjectURL = url => { blobs.delete(url); revokeURL(url); };
  HTMLAnchorElement.prototype.click = function () {
    const blob = blobs.get(this.href);
    if (!blob || !this.download) return click.call(this);
    const filename = this.download;
    if (!/^money-snapshot(?:-plan)?-[A-Za-z0-9-]+\.(txt|json)$/.test(filename)) { status('This export format is not supported.'); return; }
    if (blob.size > MAX_BYTES) { status('This export is too large. Choose a shorter analysis window.'); return; }
    // Read the retained Blob directly. No fetch, network call or base64 copy.
    blob.text().then(text => {
      send({type: 'save', filename, text});
      status('Choose where to save your file.');
    }).catch(() => status('The export could not be prepared. Please try again.'));
  };
  window.print = () => {
    const report = document.getElementById('report');
    const stale = document.getElementById('report-stale');
    if (!report || report.hidden || (stale && !stale.hidden)) { status('Build an up-to-date report before printing.'); return; }
    window.dispatchEvent(new Event('beforeprint'));
    requestAnimationFrame(() => requestAnimationFrame(() => send({type: 'print'})));
  };
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.download) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname) return;
    event.preventDefault();
    if (url.protocol !== 'https:') { status('Only secure website links can be opened.'); return; }
    send({type: 'open', url: url.href});
  }, true);
})();
