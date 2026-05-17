const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('https://ritual-agent-feeds.vercel.app/feed', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // Check computed styles of first feed entry card
  const card = await page.locator('.card').nth(2); // 0=wallet, 1=composer, 2=first entry
  const styles = await card.evaluate(el => ({
    display: getComputedStyle(el).display,
    visibility: getComputedStyle(el).visibility,
    opacity: getComputedStyle(el).opacity,
    background: getComputedStyle(el).background,
    position: getComputedStyle(el).position,
    zIndex: getComputedStyle(el).zIndex,
    height: el.offsetHeight,
    width: el.offsetWidth,
    top: el.getBoundingClientRect().top,
  }));
  console.log('Feed entry card styles:', styles);

  // Check if text is actually there
  const text = await card.locator('p.text-sm').textContent();
  console.log('Card text:', text);

  await browser.close();
})();
