from playwright.sync_api import sync_playwright
import os
BASE = os.environ.get("APP_TEST_URL", "http://localhost:8004")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE + '/apps/financial-reset/');
 for scenario in ['recovery','deficit','growth']:
  page.locator('#demo-scenario').select_option(scenario);page.locator('#demo').click();assert page.locator('#report').is_visible(),page.locator('#app-status').inner_text();text=page.locator('#report').inner_text();assert 'Check medical-expense tax credits and reimbursement' in text;assert 'Every expense, four saving pillars' in text;assert page.locator('.expense-pillars thead th').count()==5;assert page.locator('.expense-pillars tbody tr').count()>7
  if scenario=='deficit':assert 'Stop the spending deficit' in text
  if scenario=='growth':assert 'Investigate investing your verified surplus' in text
  else:assert 'Resolve charges you do not recognize' in text
  assert page.locator('#app-status').inner_text().startswith('Fictional report generated'),page.locator('#app-status').inner_text()
 with page.expect_download() as info:page.locator('#download-report').click()
 assert info.value.suggested_filename.endswith('.txt');page.locator('#essentials').fill('3200');assert page.locator('#report-stale').is_visible();assert page.locator('#download-report').is_disabled();page.locator('#analyze').click();assert page.locator('#report-stale').is_hidden();page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/tmp/reset-report-mobile.png',full_page=True);assert not errors,errors
 demo=page.evaluate('ResetDemo.create("recovery")');page.reload();page.locator('#card-file').set_input_files({'name':'card.csv','mimeType':'text/csv','buffer':demo['card'].encode()});page.locator('#chequing-file').set_input_files({'name':'chequing.csv','mimeType':'text/csv','buffer':demo['chequing'].encode()});page.locator('#import').click();page.locator('#coverage').check();page.locator('#cad-confirmed').check();page.locator('#start-date').fill('2026-07-01');page.locator('#end-date').fill('2026-09-30');page.locator('#analyze').click();assert page.locator('#report').is_visible();assert 'medical-expense' in page.locator('#report').inner_text();assert page.locator('.expense-pillars thead th').count()==5;assert 'Fictional demonstration report' not in page.locator('#report').inner_text();assert not errors,errors;b.close();print('Three one-click scenarios, medical guidance, four-pillar matrix, download, stale-report protection and mobile passed')
