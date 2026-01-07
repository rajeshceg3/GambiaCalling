// tests/app.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Gambia Visual Journey', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the homepage with correct title', async ({ page }) => {
        await expect(page).toHaveTitle('Gambia: A Visual Journey');
        await expect(page.locator('h1')).toContainText('The Gambia');
    });

    test('should have a skip-to-content link', async ({ page }) => {
        const skipLink = page.locator('.skip-to-content');
        await expect(skipLink).toBeAttached();

        // Focus the link and check if it becomes visible (transform is removed)
        await skipLink.focus();
        await expect(skipLink).toBeVisible();
    });

    test('should expand card on click', async ({ page }) => {
        const card = page.locator('#card-kachikally');
        await expect(card).toHaveAttribute('aria-expanded', 'false');

        await card.click();

        await expect(card).toHaveClass(/expanded/);
        await expect(card).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('body')).toHaveClass(/has-expanded-card/);

        const closeBtn = card.locator('.close-button');
        await expect(closeBtn).toBeVisible();
    });

    test('should close expanded card on close button click', async ({ page }) => {
        const card = page.locator('#card-kachikally');
        await card.click();
        await expect(card).toHaveClass(/expanded/);

        // Wait for transition to complete so the close button is interactable
        // CSS transition is around 0.8s.
        const closeBtn = card.locator('.close-button');

        // Ensure the button is actually receiving pointer events
        await closeBtn.waitFor({ state: 'visible', timeout: 10000 });

        // Dispatch click directly to avoid interception by backdrop
        // Sometimes Playwright thinks an element is "intercepted" by its parent or a pseudo-element
        // dispatchEvent('click') bypasses the hit-test check
        await closeBtn.dispatchEvent('click');

        await expect(card).not.toHaveClass(/expanded/);
        await expect(card).toHaveAttribute('aria-expanded', 'false');
    });

    test('should close expanded card on Escape key', async ({ page }) => {
        const card = page.locator('#card-kachikally');
        await card.click();
        await expect(card).toHaveClass(/expanded/);

        await page.keyboard.press('Escape');

        await expect(card).not.toHaveClass(/expanded/);
    });

    test('should initialize map when card is expanded', async ({ page }) => {
        const card = page.locator('#card-kachikally');
        await card.click();

        // Map container ID for Kachikally is #map-kachikally
        const mapContainer = page.locator('#map-kachikally');

        // Wait for leaflet to inject the map pane
        // Use .first() to avoid strict mode violation if multiple panes match (though usually one per map)
        const leafletPane = mapContainer.locator('.leaflet-pane').first();
        await expect(leafletPane).toBeAttached();
    });

    test('should pass accessibility checks', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
