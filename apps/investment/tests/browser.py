from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(locale='en-CA',timezone_id='America/Edmonton',viewport={'width':1280,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(os.environ.get('APP_TEST_URL','http://localhost:8024')+'/apps/investment/')
 assert page.locator('#total').inner_text()=='$1,200.00'
 initial=page.locator('#ball-position').get_attribute('transform');initial_radius=float(page.locator('#ball-outline').get_attribute('r'))
 page.locator('#timeline').fill('10');assert page.locator('#total').inner_text()=='$2,149.02';assert initial!=page.locator('#ball-position').get_attribute('transform');assert float(page.locator('#ball-outline').get_attribute('r'))>initial_radius;assert page.locator('#profit-ring').get_attribute('visibility')=='visible';assert abs(float(page.locator('#principal-ball').get_attribute('r'))-initial_radius)<0.001
 page.locator('#years').fill('20');assert page.locator('#timeline').get_attribute('max')=='20';page.locator('#timeline').fill('20');assert page.locator('#total').inner_text()=='$3,848.56'
 page.locator('#rate').fill('-100');assert page.locator('#total').inner_text()=='$0.00';assert page.locator('#growth-label').inner_text()=='Loss of principal';assert page.locator('#profit-ring').get_attribute('visibility')=='hidden';assert float(page.locator('#ball-outline').get_attribute('r'))==0
 page.locator('#timeline').fill('0');assert page.locator('#total').inner_text()=='$1,200.00';page.locator('#timeline').focus();page.keyboard.press('ArrowRight');assert page.locator('#selected-year').inner_text()=='Year 1'
 page.locator('#years').fill('2.5');assert page.locator('#error').is_visible();assert page.locator('#timeline').is_disabled();page.locator('#years').fill('10');page.locator('#rate').fill('6');page.locator('#principal').fill('0');assert page.locator('#total').inner_text()=='$0.00'
 page.locator('#principal').fill('1200');page.locator('#timeline').fill('10');page.screenshot(path='/tmp/investment-desktop.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/tmp/investment-mobile.png',full_page=True);assert not errors,errors
 # Simulate cached markup from the earlier pie-slice version with the current script.
 def old_markup(route):
  response=route.fetch();html=response.text().replace('<circle id="profit-ring" fill="url(#ice-amber)"/>','<path id="profit-wedge" fill="#c97624"/>').replace('<circle id="core-outline" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>','');route.fulfill(response=response,body=html)
 page.route('**/apps/investment/',old_markup);page.reload();page.locator('#timeline').fill('10');assert page.locator('#total').inner_text()=='$2,149.02';assert page.locator('#profit-ring').count()==1;assert page.locator('#error').is_hidden();assert not errors,errors;b.close()
 print('Slider, compounding, updated horizon, loss/zero scenarios, validation, keyboard and mobile checks passed.')
