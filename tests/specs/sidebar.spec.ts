import { test, expect } from '../../fixtures';

let mobile: boolean;

test.describe('Sidebar', () => {
    test.beforeAll(({ isMobile, userAgent }) => {
        mobile = !!(isMobile && !userAgent?.includes('iPad'));
    });

    test('Sidebar is visible on the page if not on mobile', async ({ basePage }) => {
        if (mobile) {
            await expect(basePage.sidebar).not.toBeVisible();
        } else {
            await expect(basePage.sidebar).toBeVisible();
        }
    });

    test('Board list title contains the board count', async ({ testBoard, basePage }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await expect(basePage.boards.first()).toBeVisible(); // Ensure boards are loaded before verifying the board count
        const boardCount = await basePage.boards.count();
        await expect(basePage.boardListHeader).toHaveText(`ALL BOARDS (${boardCount})`, {
            useInnerText: true,
        });
    });

    test('Existing boards are displayed', async ({ testBoard, basePage }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await expect(basePage.boards).toContainText([testBoard.name]);
    });

    test('New Board modal can be opened from the sidebar', async ({ basePage, pageObjects }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await expect(basePage.newBoardBtn).toBeVisible();
        await expect(basePage.newBoardBtn).toHaveText('+ Create New Board');
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await expect(modal.rootElement).toBeVisible();
        await expect(modal.header).toHaveText('Add New Board');
    });

    test.describe(() => {
        test.skip(({ isMobile, userAgent }) => {
            return !!(isMobile && !userAgent?.includes('iPad'));
        }, 'Sidebar cannot be toggled on mobile');
        test('Sidebar can be toggled', async ({ basePage }) => {
            await expect(basePage.hideSidebarBtn).toBeVisible();
            await expect(basePage.showSidebarBtn).not.toBeVisible();
            await basePage.hideSidebarBtn.click();
            await expect(basePage.sidebar).not.toBeVisible();
            await expect(basePage.showSidebarBtn).toBeVisible();
            await basePage.showSidebarBtn.click();
            await expect(basePage.sidebar).toBeVisible();
            await expect(basePage.showSidebarBtn).not.toBeVisible();
        });
    });
});
