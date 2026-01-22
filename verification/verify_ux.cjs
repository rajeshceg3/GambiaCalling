const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to homepage
  await page.goto('http://localhost:8080');
  await page.setViewportSize({ width: 1280, height: 800 });

  // 2. Focus on first card (check new focus ring)
  await page.keyboard.press('Tab'); // Skip to content
  await page.keyboard.press('Tab'); // First card
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/01_focus_ring.png' });
  console.log('Taken focus ring screenshot');

  // 3. Expand card (check animation & final state)
  await page.keyboard.press('Enter');

  // Wait for content (checking the close button delay I added)
  // Close button delay is 0.7s, animation total ~1.0s
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'verification/02_expanded_card.png' });
  console.log('Taken expanded card screenshot');

  await browser.close();
})();
