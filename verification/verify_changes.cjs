const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('Navigating to app...');
    await page.goto('http://localhost:8080');

    console.log('Waiting for initial load...');
    await page.waitForLoadState('networkidle');

    // Test Case 1: Trigger an error toast
    console.log('Triggering error toast...');
    await page.evaluate(() => {
        // Import the function dynamically if needed, or trigger via a known global if exposed.
        // Since it's a module, we might need to expose it or simulate an event.
        // Simulating an unhandled rejection to trigger the global handler
        Promise.reject(new Error('Test System Alert'));
    });

    // Wait for toast to appear
    const toast = page.locator('.error-toast');
    await toast.waitFor({ state: 'visible' });
    console.log('Toast visible. Taking screenshot...');
    await page.screenshot({ path: 'verification/toast_visible.png' });

    // Wait for dismissal (5s + transition)
    console.log('Waiting for auto-dismissal...');
    // We can speed this up by manually adding the class or waiting
    // But let's verify the class addition
    await page.evaluate(() => {
        const t = document.querySelector('.error-toast');
        if (t) t.classList.add('dismissing'); // Force dismissal state for screenshot
    });

    await page.waitForTimeout(100); // Wait a bit for transition to start
    await page.screenshot({ path: 'verification/toast_dismissing.png' });

    // Test Case 2: Map Interaction
    console.log('Expanding card...');
    await page.click('#card-kachikally');

    // Wait for expansion
    await page.waitForSelector('.card.expanded');

    // Wait for map to load (check for map-loading removal)
    // The map-loading class should be removed when tiles load
    // We want to verify the marker is present
    const marker = page.locator('.marker-pin.marker-kachikally');
    await marker.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Marker visible. Taking screenshot...');
    await page.screenshot({ path: 'verification/map_loaded.png' });

    await browser.close();
})();
