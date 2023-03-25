import { test, expect } from '../../fixtures';

let mobile: boolean;

test.describe('Theme', () => {
    test.beforeAll(({ isMobile, userAgent }) => {
        mobile = !!(isMobile && !userAgent?.includes('iPad'));
    });

    test.describe(async () => {
        test.use({
            colorScheme: 'dark',
        });

        test('Dark theme is applied based on user preference', async ({ basePage }) => {
            await expect(basePage.appRootElement).toHaveClass(/dark/);
        });

        test('Can switch to light theme', async ({ basePage }) => {
            if (mobile) await basePage.mobileMenuToggle.click();
            await basePage.themeToggle.click();
            await expect(basePage.appRootElement).not.toHaveClass(/dark/);
        });

        test('Explicitly set preference (light) persists after refreshing', async ({ basePage }) => {
            if (mobile) await basePage.mobileMenuToggle.click();
            await basePage.themeToggle.click();
            await basePage.page.reload();
            await expect(basePage.appRootElement).not.toHaveClass(/dark/);
        });
    });

    test.describe(async () => {
        test.use({
            colorScheme: 'light',
        });

        test('Light theme is applied based on user preference', async ({ basePage }) => {
            await expect(basePage.appRootElement).not.toHaveClass(/dark/);
        });

        test('Can switch to dark theme', async ({ basePage }) => {
            if (mobile) await basePage.mobileMenuToggle.click();
            await basePage.themeToggle.click();
            await expect(basePage.appRootElement).toHaveClass(/dark/);
        });

        test('Explicitly set preference (dark) persists after refreshing', async ({ basePage }) => {
            if (mobile) await basePage.mobileMenuToggle.click();
            await basePage.themeToggle.click();
            await basePage.page.reload();
            await expect(basePage.appRootElement).toHaveClass(/dark/);
        });
    });
});
