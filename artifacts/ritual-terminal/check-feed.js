const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));
  await page.goto('https://ritual-agent-feeds.vercel.app/feed', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  const cards = await page.locator('.card').count();
  console.log('Card count:', cards);
  const texts = await page.locator('.card p.text-sm').allTextContents();
  console.log('Messages found:', texts.length);
  console.log('First 5:', texts.slice(0, 5));
  await browser.close();
})();
