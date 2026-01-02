import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Production Readiness Checks', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000');
    });

    test('should have correct title and metadata', async ({ page }) => {
        await expect(page).toHaveTitle('Gambia: A Visual Journey');
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /visual journey/);
    });

    test('should pass accessibility scan (WCAG)', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should expand card and load map on interaction', async ({ page }) => {
        const card = page.locator('#card-kachikally');
        await card.click();

        await expect(card).toHaveClass(/expanded/);
        await expect(page.locator('.close-button').first()).toBeVisible();

        // Check map container visibility
        const mapContainer = page.locator('#map-kachikally');
        await expect(mapContainer).toBeVisible();

        // Close card
        await page.locator('.close-button').first().click();
        await expect(card).not.toHaveClass(/expanded/);
    });

    test('should manage focus correctly', async ({ page }) => {
        const card = page.locator('#card-kachikally');

        // Trigger with keyboard
        await card.focus();
        await page.keyboard.press('Enter');

        await expect(card).toHaveClass(/expanded/);

        // Close button should eventually receive focus (after timeout in script)
        const closeBtn = card.locator('.close-button');
        await expect(closeBtn).toBeFocused();

        // Close with keyboard
        await page.keyboard.press('Enter');
        await expect(card).not.toHaveClass(/expanded/);
        await expect(card).toBeFocused();
    });

    test('should have valid CSP', async ({ page }) => {
        const csp = await page.evaluate(() => {
            return document.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
        });
        expect(csp).toContain("default-src 'self'");
    });
});
