const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('https://ritual-agent-feeds.vercel.app/feed', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const main = await page.locator('main').evaluate(el => ({
    position: getComputedStyle(el).position,
    zIndex: getComputedStyle(el).zIndex,
  }));
  console.log('main styles:', main);

  const cosmic = await page.locator('.fixed.inset-0').first().evaluate(el => ({
    position: getComputedStyle(el).position,
    zIndex: getComputedStyle(el).zIndex,
  }));
  console.log('cosmic styles:', cosmic);

  // Check if feed entry is visible (bounding box)
  const card = await page.locator('.card').nth(2);
  const box = await card.boundingBox();
  console.log('card bounding box:', box);

  // Screenshot just the feed area
  await page.screenshot({ path: 'feed-area.png', clip: { x: 350, y: 350, width: 700, height: 400 } });
  console.log('Saved feed-area.png');

  await browser.close();
})();
