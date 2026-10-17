"""Selected-currency integration for the standalone editable calculators."""
from playwright.sync_api import sync_playwright
import os

base = os.environ.get('APP_TEST_URL', 'http://localhost:8045')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(locale='en-GB', timezone_id='Europe/London')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))

    page.goto(base + '/apps/investment/')
    assert page.evaluate('SiteCurrency.code') == 'GBP'
    assert 'GBP' in page.locator('label[for="principal"]').inner_text()
    assert page.locator('#total').inner_text() == '£1,200.00'
    page.fill('#timeline', '7')
    radius = page.locator('#ball-outline').get_attribute('r')
    page.select_option('#site-currency', 'INR')
    assert page.locator('#timeline').input_value() == '7'
    assert page.locator('#ball-outline').get_attribute('r') == radius
    assert page.locator('#total').inner_text() == page.evaluate('SiteCurrency.format(Investment.project(1200,6,7).total)')
    assert 'INR' in page.locator('label[for="principal"]').inner_text()

    page.goto(base + '/apps/true-cost/')
    assert page.evaluate('SiteCurrency.code') == 'INR', 'Manual currency preference should follow navigation'
    page.select_option('#site-currency', 'auto')
    assert page.evaluate('SiteCurrency.code') == 'GBP'
    page.select_option('#mode', 'hour')
    page.fill('#pay', '30')
    page.fill('#item', 'My phone')
    hours = page.locator('.time-number').inner_text()
    page.select_option('#site-currency', 'USD')
    assert page.locator('#pay').input_value() == '30'
    assert page.locator('.time-number').inner_text() == hours
    assert 'USD' in page.locator('#pay-label').inner_text()
    assert 'USD' in page.locator('label[for="price"]').inner_text()
    assert 'US$' in page.locator('.cost-stats').inner_text()
    assert 'My phone' in page.locator('#result').inner_text()
    assert 'does not adapt Canadian CPP' in page.locator('.howto').inner_text()
    with page.expect_download() as downloaded:
        page.click('#download')
    with open(downloaded.value.path()) as estimate:
        assert 'Currency: USD' in estimate.read()

    page.goto(base + '/apps/checklist/')
    assert page.evaluate('SiteCurrency.code') == 'USD'
    page.select_option('#site-currency', 'auto')
    assert page.evaluate('SiteCurrency.code') == 'GBP'
    page.check('input[name="q-0-0"][value="yes"]')
    page.fill('#action-1', 'Keep this note')
    page.click('#show-report')
    for field, value in [('income','3000'),('expenses','2500'),('leakage','50'),('living','100'),('benefits','100'),('habits','50')]:
        page.fill('#money-' + field, value)
    assert '£800.00' in page.locator('#money-result').inner_text()
    page.select_option('#site-currency', 'EUR')
    assert page.locator('input[name="q-0-0"][value="yes"]').is_checked()
    assert page.locator('#action-1').input_value() == 'Keep this note'
    assert '100%' in page.locator('.score-overview').inner_text()
    assert '€800.00' in page.locator('#money-result').inner_text()
    assert 'EUR/month' in page.locator('label[for="money-income"]').inner_text()
    page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
    assert 'Keep this note' in page.locator('#print-action-1').text_content()
    page.set_viewport_size({'width': 390, 'height': 844})
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert not errors, errors
    browser.close()
    print('GBP detection, remembered currency, live report/label changes, preserved calculator/checklist state, currency in downloads and mobile passed.')
