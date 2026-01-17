
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the app
    await page.goto('http://localhost:8080');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Click on a card to expand it (e.g., Kachikally)
    await page.click('#card-kachikally');

    // Wait for the card to expand (transition)
    await page.waitForSelector('.card.expanded');

    // Wait for the map container to be visible
    // Note: Leaflet layers might take time or be hidden by CSS if logic is flawed, so we check the container first
    await page.waitForSelector('#map-kachikally', { state: 'visible' });

    // Wait a bit for Leaflet to initialize and add the tile layer
    // We check for the leaflet-container class which Leaflet adds
    await page.waitForSelector('#map-kachikally.leaflet-container', { state: 'visible' });

    // Wait for the marker to be present in the DOM
    // It might animate in, so we just wait for presence first
    await page.waitForSelector('.marker-pin');

    // Wait for the animation to complete (approx 800ms + buffer)
    await page.waitForTimeout(1000);

    // Take a screenshot of the expanded card with the map
    await page.screenshot({ path: 'verification/expanded_card_map.png' });

    console.log('Screenshot taken: verification/expanded_card_map.png');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
})();
