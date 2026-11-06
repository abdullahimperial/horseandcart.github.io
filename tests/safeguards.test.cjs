const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function storage(entries) {
  const values = new Map(Object.entries(entries));
  return {values, get length() { return values.size; }, key(i) { return [...values.keys()][i] ?? null; }, removeItem(k) { values.delete(k); }};
}
function privacyHarness(consent, denied = false) {
  let click;
  const local = storage({'pf-course-workbook-v2-m3': 'private notes', 'pf-course-module-3': 'complete', 'lfm-currency': 'CAD', 'lfm-last-module': '3', 'unrelated-setting': 'keep'});
  const session = storage({'lfm-intro-seen': '1', 'unrelated-session': 'keep'});
  const status = {textContent: ''};
  const win = {confirm: () => consent, localStorage: local, sessionStorage: session};
  if (denied) Object.defineProperty(win, 'localStorage', {get() { throw new Error('storage disabled'); }});
  const document = {getElementById: id => id === 'clear-site-learning-data' ? {addEventListener: (_, fn) => { click = fn; }} : status};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/privacy-controls.js'), 'utf8'), {window: win, document});
  return {click, local, session, status};
}
test('privacy control leaves all data intact when confirmation is cancelled', () => {
  const h = privacyHarness(false); h.click();
  assert.equal(h.local.values.size, 5); assert.equal(h.session.values.size, 2);
  assert.equal(h.status.textContent, '');
});
test('privacy control removes owned learning data and preserves unrelated storage', () => {
  const h = privacyHarness(true); h.click();
  assert.deepEqual([...h.local.values], [['unrelated-setting', 'keep']]);
  assert.deepEqual([...h.session.values], [['unrelated-session', 'keep']]);
  assert.match(h.status.textContent, /cleared/);
  h.click(); assert.match(h.status.textContent, /No saved/);
});
test('privacy control reports blocked storage instead of claiming complete deletion', () => {
  const h = privacyHarness(true, true); h.click();
  assert.match(h.status.textContent, /could not be cleared/);
  assert.equal(h.local.values.get('pf-course-workbook-v2-m3'), 'private notes');
});
require('../apps/financial-reset/planner.js');
test('legacy plan imports preserve actions and receive the current educational notice', () => {
  const old = {format: 'horse-cart-reset-plan', version: 1, currency: 'CAD', start: '2026-10-01', end: '2026-10-31', days: 31,
    stats: {monthlyIncome: 4200, monthlyExpenses: 3800, monthlySurplus: 400, financingMonthly: 0, reserve: 6000, essentials: 2000, debtTotal: 0},
    actions: [{id: 'review-costs', title: 'Review costs', status: 'doing', due: '2026-11-30', notes: 'Compare two quotes', impact: 25}]};
  const clean = global.ResetPlanner.validate(old);
  assert.deepEqual(clean.actions, old.actions); assert.deepEqual(clean.stats, old.stats);
  assert.match(clean.notice, /not individualized/); assert.match(clean.notice, /terms\.html/);
  const hostile = global.ResetPlanner.validate({...old, notice: '<script>fake guarantee</script>'});
  assert.equal(hostile.notice, clean.notice);
});
test('true-cost download includes limits without dropping the calculation or assumptions', async () => {
  const source = fs.readFileSync(path.join(root, 'apps/true-cost/app.js'), 'utf8');
  const fn = source.match(/function download\(\)\{[^\n]+/)[0];
  let downloaded;
  const context = {last: {v: {price: 100, years: 10}}, $: () => ({innerText: 'Estimated gross earnings: CAD 140'}),
    window: {SiteCurrency: {code: 'CAD'}}, Blob, URL: {createObjectURL: blob => {downloaded = blob; return 'blob:test';}, revokeObjectURL() {}},
    document: {createElement: () => ({click() {}})}, setTimeout() {}};
  vm.runInNewContext(fn + '\ndownload();', context);
  const text = await downloaded.text();
  assert.match(text, /not individualized/); assert.match(text, /Estimated gross earnings: CAD 140/);
  assert.match(text, /price: 100/); assert.match(text, /years: 10/); assert.match(text, /privacy\.html/);
});
