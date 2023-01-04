import { test, expect } from '@playwright/test';

test.describe('Kanban app', () => {
    test('has title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Kanban Board/);
    });
});
