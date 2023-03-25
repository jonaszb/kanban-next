import { test as base, expect } from '../../fixtures';
import { Board } from '../../types';
import BoardPage from '../pageObjects/BoardPage';

let mobile: boolean;
let boardName: string;

const test = base.extend<{ boardPageWithColumns: [BoardPage, Board] }>({
    boardPageWithColumns: async ({ apiUtils, page, pageObjects }, use) => {
        boardName = `Test ${Math.floor(Math.random() * 10 ** 10)}`;
        const board = await apiUtils.createBoard({
            name: boardName,
            columns: [
                { name: 'Column 1', color: '#FFF000' },
                { name: 'Column 2', color: '#000FFF' },
            ],
        });
        const boardPage = new pageObjects.BoardPage(page, board.uuid);
        await boardPage.goto();
        await use([boardPage, board]);
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },
});

test.describe('Editing a board', () => {
    test.beforeAll(({ isMobile, userAgent }) => {
        mobile = !!(isMobile && !userAgent?.includes('iPad'));
    });

    test('Modal is opened when "Edit Board" option is selected', async ({
        boardPage: [boardPage, boardData],
        pageObjects,
    }) => {
        await boardPage.boardOptionsBtn.click();
        await expect(boardPage.editBoardBtn).toBeVisible();
        await expect(boardPage.editBoardBtn).toHaveText('Edit Board');
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await expect(modal.rootElement).toBeVisible();
        await expect(modal.header).toHaveText('Edit Board');
        await expect(modal.boardName).toBeVisible();
        await expect(modal.boardName).toHaveValue(boardData.name);
        await expect(modal.addColumnBtn).toBeVisible();
        await expect(modal.addColumnBtn).toHaveText('+ Add New Column');
        await expect(modal.submitBtn).toBeVisible();
        await expect(modal.submitBtn).toHaveText('Save Changes');
        await expect(modal.columnRows).toHaveCount(0);
    });

    test('Board name can be changed', async ({ boardPage: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await modal.boardName.fill('Edited');
        await expect(modal.boardName).toHaveValue('Edited');
        await modal.submitBtn.click();
        await expect(boardPage.boardHeader).toHaveText(`Edited`);
    });

    test('New column can be added if none exist', async ({ boardPage: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await modal.addColumnBtn.click();
        await modal.nthColInput(0).fill('Column 1');
        await modal.submitBtn.click();
        await expect(boardPage.nthColumnHeader(0)).toHaveText(['Column 1 (0)']);
    });

    test('New column can be added if some exist', async ({ boardPageWithColumns: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await expect(modal.columnRows).toHaveCount(2);
        await modal.addColumnBtn.click();
        await expect(modal.columnRows).toHaveCount(3);
        await modal.nthColInput(2).fill('Column 3');
        await expect(modal.nthColInput(2)).toHaveValue('Column 3');
        await modal.submitBtn.click();
        await expect(boardPage.nthColumnHeader(2)).toHaveText(['Column 3 (0)']);
    });

    test('Column name can be changed', async ({ boardPageWithColumns: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await expect(modal.columnRows).toHaveCount(2);
        await modal.nthColInput(0).fill('Edited');
        await modal.submitBtn.click();
        await expect(boardPage.nthColumnHeader(0)).toHaveText(['Edited (0)']);
    });

    test('Column can be removed', async ({ boardPageWithColumns: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await expect(modal.columnRows).toHaveCount(2);
        await modal.nthColDeleteBtn(0).click();
        await expect(modal.columnRows).toHaveCount(1);
        await modal.submitBtn.click();
        const deleteModal = new pageObjects.DeleteModal(boardPage.page);
        await expect(deleteModal.rootElement).toBeVisible();
        await expect(deleteModal.header).toHaveText('Delete column(s)?');
        await deleteModal.deleteBtn.click();
        await expect(boardPage.nthColumnHeader(0)).toHaveText(['Column 2 (0)']);
    });

    test('Column name cannot be blank', async ({ boardPageWithColumns: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await expect(modal.columnRows).toHaveCount(2);
        await modal.nthColInput(0).fill('');
        await expect(modal.nthColInput(0)).toHaveValue('');
        await modal.submitBtn.click();
        await expect(modal.columnRows.nth(0)).toContainText("Can't be empty");
    });

    test('Board name cannot be blank', async ({ boardPageWithColumns: [boardPage], pageObjects }) => {
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const modal = new pageObjects.BoardModal(boardPage.page);
        await modal.boardName.fill('');
        await expect(modal.boardName).toHaveValue('');
        await modal.submitBtn.click();
        await expect(modal.fieldError('Board Name')).toHaveText("Can't be empty");
    });

    test('New column can be added using the "New Column" button', async ({ boardPage: [boardPage] }) => {
        await expect(boardPage.newColumnLabel).toBeVisible();
        await boardPage.newColumnLabel.click();
        await expect(boardPage.newColumnInput).toBeVisible();
        await boardPage.newColumnInput.fill('New column');
        await expect(boardPage.newColumnInput).toHaveValue('New column');
        await boardPage.newColumnInput.press('Enter');
        await expect(boardPage.nthColumnHeader(0)).toHaveText(['New column (0)']);
    });
});
