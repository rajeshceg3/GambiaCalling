import { test, expect } from '@playwright/test';

test.describe('UX: Visual Feedback', () => {
    test('should show skeleton pulse while map is loading', async ({ page }) => {
        // Intercept map tile requests to artificially delay them
        // CartoDB tiles usually look like: https://a.basemaps.cartocdn.com/rastertiles/voyager/...
        await page.route('**/*.png', async (route) => {
            if (route.request().url().includes('basemaps.cartocdn.com')) {
                // Add a delay to simulate slow network
                await new Promise((f) => setTimeout(f, 1000));
            }
            await route.continue();
        });

        await page.goto('/');

        const card = page.locator('#card-kachikally');
        await card.click();

        // The map container should have the loading class immediately after expansion starts/finishes
        // Note: The app adds the class in requestAnimationFrame inside expandCard
        const mapContainer = page.locator('#map-kachikally');

        // We expect the loading class to be present
        await expect(mapContainer).toHaveClass(/map-loading/, { timeout: 2000 });

        // Eventually (after our delay), the loading class should be removed
        await expect(mapContainer).not.toHaveClass(/map-loading/, { timeout: 10000 });
    });
});
