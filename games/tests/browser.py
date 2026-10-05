from playwright.sync_api import sync_playwright
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce'); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for path in ['financial-life.html','snakes-and-ladders.html']:
  page.goto('http://127.0.0.1:8001/games/'+path);page.screenshot(path='/tmp/'+path+'.png',full_page=True)
  assert page.locator('.site-notice').is_visible()
 page.evaluate('Math.random=()=>0');page.locator('#roll').click();page.wait_for_timeout(500);assert page.locator('#board').get_attribute('data-position')=='2'
 page.locator('#theme').select_option('book');page.wait_for_timeout(200)
 def check():
  assert page.evaluate('''()=>{const token=document.querySelector('#token').getBoundingClientRect(),cell=document.querySelector('.board-cell.current').getBoundingClientRect();return Math.abs(token.x+token.width/2-cell.x-cell.width/2)<1&&Math.abs(token.y+token.height/2-cell.y-cell.height/2)<1}''')
 check();page.locator('summary').click();page.locator('#align').check();page.locator('[data-axis=x][data-index="3"]').focus();page.keyboard.press('ArrowRight');check()
 page.locator('#upload').set_input_files(str(ROOT / 'games/board.png'));page.wait_for_timeout(200);check()
 page.set_viewport_size({'width':390,'height':844});check();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/tmp/board-mobile.png',full_page=True)
 page.goto('http://127.0.0.1:8001/games/financial-life.html');page.evaluate('Math.random=()=>0');page.locator('#roll').click();page.wait_for_timeout(500);page.locator('[data-value="college"]').click();page.locator('#roll').click();page.wait_for_timeout(500);page.locator('[data-value="transit"]').click();page.locator('#roll').click();page.wait_for_timeout(500);page.locator('[data-action="marriage"][data-value="false"]').click();page.locator('#children-next').click();page.locator('[data-value="rent"]').click();assert '62' in page.locator('#stage-title').inner_text();assert '$114,500' in page.locator('#total').inner_text();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/tmp/life-mobile.png',full_page=True)
 page.locator('#restart').click();page.locator('#roll').click();page.locator('#restart').click();page.wait_for_timeout(600);assert page.locator('#age').inner_text()=='18';assert page.locator('#roll').is_enabled()
 for alias in ['financial_life.html','financial_life.html.html']:
  page.goto('http://127.0.0.1:8001/games/'+alias);page.wait_for_url('**/financial-life.html')
 assert not errors,errors
 browser.close();print('Desktop/mobile gameplay, artwork alignment, keyboard adjustment, upload, restart and aliases passed')
