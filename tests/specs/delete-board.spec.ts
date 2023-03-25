import { test, expect } from '../../fixtures';

test.describe('Delete board', () => {
    test('Modal is opened when "Delete Board" button is clicked', async ({
        boardPage: boardPageFixture,
        pageObjects,
    }) => {
        const [boardPage, testBoard] = boardPageFixture;
        await boardPage.boardOptionsBtn.click();
        await boardPage.deleteBoardBtn.click();
        const modal = new pageObjects.DeleteModal(boardPage.page);
        await expect(modal.rootElement).toBeVisible();
        await expect(modal.header).toHaveText('Delete this board?');
        await expect(modal.message).toHaveText(
            `Are you sure you want to delete the ‘${testBoard.name}’ board? This action will remove all columns and tasks and cannot be reversed.`
        );
        await expect(modal.deleteBtn).toBeVisible();
        await expect(modal.cancelBtn).toBeVisible();
    });

    test('Cancel button closes the modal without deleting the board', async ({
        boardPage: boardPageFixture,
        request,
        pageObjects,
    }) => {
        const [boardPage, testBoard] = boardPageFixture;
        await boardPage.boardOptionsBtn.click();
        await boardPage.deleteBoardBtn.click();
        const modal = new pageObjects.DeleteModal(boardPage.page);
        await modal.cancelBtn.click();
        await expect(modal.rootElement).not.toBeVisible();
        const response = await request.get('/api/boards/' + testBoard.uuid);
        expect(response).toBeOK();
    });

    test('Board is deleted if Delete button is clicked', async ({
        boardPage: boardPageFixture,
        request,
        pageObjects,
    }) => {
        const [boardPage, testBoard] = boardPageFixture;
        await boardPage.boardOptionsBtn.click();
        await boardPage.deleteBoardBtn.click();
        const modal = new pageObjects.DeleteModal(boardPage.page);
        await modal.deleteBtn.click();
        await expect(modal.rootElement).not.toBeVisible();
        const response = await request.get('/api/boards/' + testBoard.uuid);
        expect(response).not.toBeOK();
    });
});
