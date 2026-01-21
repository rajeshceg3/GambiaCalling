import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Expanded State', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should pass WCAG checks when card is expanded', async ({ page }) => {
        const card = page.locator('#card-kachikally');

        // Expand the card
        await card.click();
        await expect(card).toHaveClass(/expanded/);

        // Wait for animation/transition to settle (animations are approx 0.8s)
        // We wait for the close button to be fully visible as a proxy for stable state
        const closeBtn = card.locator('.close-button');
        await expect(closeBtn).toBeVisible();

        // Run Axe
        // We explicitly check the expanded card to ensure no nested interactive controls issues
        // (which was the previous vulnerability)
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('#card-kachikally')
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should verify correct role management in expanded state', async ({ page }) => {
        // This test explicitly validates the "Dynamic Role Switching" logic
        const card = page.locator('#card-kachikally');

        // Initial State: It should be a button
        await expect(card).toHaveAttribute('role', 'button');
        await expect(card).toHaveAttribute('tabindex', '0');
        await expect(card).toHaveAttribute('aria-expanded', 'false');

        // Expand
        await card.click();
        await expect(card).toHaveClass(/expanded/);

        // Expanded State: It should NOT be a button (generic container)
        await expect(card).not.toHaveAttribute('role', 'button');
        await expect(card).not.toHaveAttribute('tabindex');
        await expect(card).not.toHaveAttribute('aria-expanded');

        // Collapse
        const closeBtn = card.locator('.close-button');
        // Force click to avoid overlay issues during transitions if any
        await closeBtn.dispatchEvent('click');

        // Restored State: Should be a button again
        await expect(card).not.toHaveClass(/expanded/);
        await expect(card).toHaveAttribute('role', 'button');
        await expect(card).toHaveAttribute('tabindex', '0');
        await expect(card).toHaveAttribute('aria-expanded', 'false');
    });
});
