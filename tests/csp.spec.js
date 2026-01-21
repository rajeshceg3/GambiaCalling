import { test, expect } from '@playwright/test';

test.describe('CSP & Supply Chain Security', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should only load resources from self and trusted tile providers', async ({ page }) => {
        const externalRequests = [];

        page.on('request', request => {
            const url = request.url();
            // Ignore data URIs
            if (url.startsWith('data:')) {return;}

            // Allow localhost/127.0.0.1 (self)
            if (url.includes('localhost') || url.includes('127.0.0.1')) {return;}

            // Allow CARTO tiles
            if (url.includes('.basemaps.cartocdn.com')) {return;}

            // Log anything else
            externalRequests.push(url);
        });

        // Trigger some interactions to load maps
        const card = page.locator('#card-kachikally');
        await card.click();
        await expect(card).toHaveClass(/expanded/);

        // Wait a bit for map tiles to start loading
        await page.waitForTimeout(2000);

        // Check if we caught any unauthorized external requests
        expect(externalRequests, `Found unauthorized external requests: ${externalRequests.join(', ')}`).toEqual([]);
    });

    test('should have strict CSP headers in meta tag', async ({ page }) => {
        const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]');
        await expect(cspMeta).toHaveCount(1);

        const content = await cspMeta.getAttribute('content');

        // Verify we removed the external domains
        expect(content).not.toContain('unpkg.com');
        expect(content).not.toContain('fonts.googleapis.com');
        expect(content).not.toContain('fonts.gstatic.com');

        // Verify we still allow what's needed
        expect(content).toContain("default-src 'self'");
        expect(content).toContain("img-src 'self' data: https://*.basemaps.cartocdn.com");
    });
});
