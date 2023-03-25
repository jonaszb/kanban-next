import { test, expect } from '../../fixtures';

let mobile: boolean;
let boardName: string;

test.describe('Add new board', () => {
    test.beforeAll(({ isMobile, userAgent }) => {
        mobile = !!(isMobile && !userAgent?.includes('iPad'));
    });

    test.afterEach(async ({ apiUtils }) => {
        if (boardName) {
            const boardToDelete = await apiUtils.getBoardByName(boardName);
            if (boardToDelete) {
                await apiUtils.deleteBoard(boardToDelete.uuid, { failOnStatusCode: false });
            }
        }
    });

    test('Modal is opened when "New Board" button is clicked', async ({ basePage, pageObjects }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await expect(basePage.newBoardBtn).toBeVisible();
        await expect(basePage.newBoardBtn).toHaveText('+ Create New Board');
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await expect(modal.rootElement).toBeVisible();
        await expect(modal.header).toHaveText('Add New Board');
        await expect(modal.boardName).toBeVisible();
        await expect(modal.addColumnBtn).toBeVisible();
        await expect(modal.addColumnBtn).toHaveText('+ Add New Column');
        await expect(modal.submitBtn).toBeVisible();
        await expect(modal.columnRows).toHaveCount(0);
    });

    test('Modal can be closed by pressing Escape', async ({ basePage, pageObjects }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await expect(modal.rootElement).toBeVisible();
        await modal.rootElement.press('Escape');
        await expect(modal.rootElement).not.toBeVisible();
    });

    test('Modal can be closed by clicking outside of it', async ({ basePage, pageObjects }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await expect(modal.rootElement).toBeVisible();
        await modal.rootElement.click({ position: { x: -10, y: -10 }, force: true });
        await expect(modal.rootElement).not.toBeVisible();
    });

    test('New board can be created without columns', async ({ basePage, pageObjects }) => {
        boardName = `Test ${Math.floor(Math.random() * 10 ** 10)}`;
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await modal.boardName.fill(boardName);
        await modal.submitBtn.click();
        await expect(basePage.boards).toContainText([boardName]);
    });

    test('New board can be created with columns', async ({ basePage, pageObjects }) => {
        boardName = `Test ${Math.floor(Math.random() * 10 ** 10)}`;
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await modal.boardName.fill(boardName);
        await modal.addColumnBtn.click();
        await modal.nthColInput(0).fill('Column 1');
        await modal.addColumnBtn.click();
        await modal.nthColInput(1).fill('Column 2');
        await modal.submitBtn.click();
        await expect(basePage.boards).toContainText([boardName]);
    });

    test('Modal is closed and user is redirected to board page when created', async ({
        basePage,
        pageObjects,
        apiUtils,
    }) => {
        boardName = `Test ${Math.floor(Math.random() * 10 ** 10)}`;
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await modal.boardName.fill(boardName);
        await modal.submitBtn.click();
        await expect(modal.rootElement).not.toBeVisible();
        const boardData = await apiUtils.getBoardByName(boardName);
        await expect.poll(() => basePage.page.url()).toContain(`/board/${boardData?.uuid}`);
    });

    test('Board cannot be created without a name', async ({ basePage, pageObjects }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await modal.submitBtn.click();
        await expect(modal.fieldError('Board Name')).toHaveText("Can't be empty");
    });

    test('Board cannot be created with blank column names', async ({ basePage, pageObjects }) => {
        if (mobile) await basePage.mobileMenuToggle.click();
        await basePage.newBoardBtn.click();
        const modal = new pageObjects.BoardModal(basePage.page);
        await modal.boardName.fill('test board');
        await modal.addColumnBtn.click();
        await expect(modal.columnRows).toHaveCount(1);
        await modal.submitBtn.click();
        await expect(modal.fieldError('Board Columns', 0)).toHaveText("Can't be empty");
        await expect(modal.fieldError('Board Name')).not.toBeVisible();
    });
});
