const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the local server
    await page.goto('http://localhost:8080');

    // Execute a script in the browser to trigger a global error
    // This simulates the behavior our error handler should catch
    await page.evaluate(() => {
        // Dispatch a mock ErrorEvent
        const event = new ErrorEvent('error', {
            message: 'Simulated System Failure',
            error: new Error('Simulated System Failure')
        });
        window.dispatchEvent(event);
    });

    // Wait for the toast to appear
    const toast = page.locator('.error-toast');
    await toast.waitFor({ state: 'visible' });

    // Screenshot
    await page.screenshot({ path: 'verification/error-toast.png' });

    await browser.close();
})();
