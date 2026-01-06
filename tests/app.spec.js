import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Gambia Visual Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Gambia: A Visual Journey/);
  });

  test('should pass accessibility scan', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should expand card on click', async ({ page }) => {
    const card = page.locator('#card-kachikally');
    await card.click();
    await expect(card).toHaveClass(/expanded/);
    await expect(page.locator('body')).toHaveClass(/has-expanded-card/);
  });

  test('should close card on close button click', async ({ page }) => {
    const card = page.locator('#card-kachikally');
    await card.click();
    await expect(card).toHaveClass(/expanded/);

    const closeBtn = card.locator('.close-button');
    // Force click because the visual design might overlap in headless mode
    // or the animation might delay stability slightly.
    await closeBtn.click({ force: true });
    // Wait for animation to likely complete or state to update
    await expect(card).not.toHaveClass(/expanded/, { timeout: 10000 });
    await expect(page.locator('body')).not.toHaveClass(/has-expanded-card/);

    // Verify focus returned to card
    await expect(card).toBeFocused();
  });

  test('should handle keyboard interaction to close card', async ({ page }) => {
    const card = page.locator('#card-kachikally');
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(card).toHaveClass(/expanded/);

    await page.keyboard.press('Escape');
    await expect(card).not.toHaveClass(/expanded/);
    await expect(card).toBeFocused();
  });

  test('should have visible skip to content link on focus', async ({ page }) => {
    const skipLink = page.locator('.skip-to-content');
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });
});
