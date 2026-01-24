import { test, expect } from '@playwright/test';

test.describe('History API Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should update URL when card expands and revert on back button', async ({ page }) => {
        const card = page.locator('#card-tanji');

        // 1. Expand Card
        await card.click();
        await expect(card).toHaveClass(/expanded/);
        await expect(page).toHaveURL(/.*#tanji/);

        // 2. Browser Back
        await page.goBack();

        // 3. Verify Collapse
        await expect(card).not.toHaveClass(/expanded/);
        await expect(page).not.toHaveURL(/.*#tanji/);
    });

    test('should revert URL when closing via UI button', async ({ page }) => {
        const card = page.locator('#card-shores');
        const closeBtn = card.locator('.close-button');

        // 1. Expand Card
        await card.click();
        await expect(page).toHaveURL(/.*#shores/);
        await expect(card).toHaveClass(/expanded/);

        // 2. Wait for animation stability
        await expect(closeBtn).toBeVisible();

        // 3. Click Close (Standard click should work now with CSS fix)
        await closeBtn.click();

        // 4. Verify URL clean
        await expect(card).not.toHaveClass(/expanded/);
        await expect(page).not.toHaveURL(/.*#shores/);
    });

    test('should revert URL when closing via Escape key', async ({ page }) => {
        const card = page.locator('#card-wassu');

        // 1. Expand
        await card.click();
        await expect(page).toHaveURL(/.*#wassu/);

        // 2. Wait for state to settle
        await expect(card).toHaveClass(/expanded/);

        // 3. Press Escape
        await page.keyboard.press('Escape');

        // 4. Verify
        await expect(card).not.toHaveClass(/expanded/);
        await expect(page).not.toHaveURL(/.*#wassu/);
    });

    test('should expand card automatically when loading URL with hash', async ({ page }) => {
        // Ensure fresh load to trigger DOMContentLoaded (bypass beforeEach's navigation to '/')
        await page.goto('about:blank');
        await page.goto('/#tanji');

        const card = page.locator('#card-tanji');

        // Check if card is expanded
        await expect(card).toHaveClass(/expanded/);
    });
});
