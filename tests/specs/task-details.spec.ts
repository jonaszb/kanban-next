import { test as base, expect } from '../../fixtures';
import { Board, Task } from '../../types';
import BoardPage from '../pageObjects/BoardPage';
import type TaskDetails from '../pageObjects/TaskDetails';

const test = base.extend<{
    taskDetailsWithSubtasks: {
        boardPage: BoardPage;
        taskData: Task;
        boardData: Board;
        taskDetails: TaskDetails;
    };
    taskDetails: {
        taskData: Task;
        taskDetails: TaskDetails;
    };
}>({
    taskDetailsWithSubtasks: async ({ apiUtils, page, pageObjects }, use) => {
        const boardName = `Test ${Math.floor(Math.random() * 10 ** 10)}`;
        const board = await apiUtils.createBoard({
            name: boardName,
            columns: [
                { name: 'First', color: '#FFF000', position: 0 },
                { name: 'Second', color: '#000FFF', position: 1 },
            ],
        });
        const boardData = await apiUtils.getBoard(board.uuid);
        const taskData = await apiUtils.createTask({
            name: 'Test task',
            subtasks: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }],
            column_uuid: boardData.columns[0].uuid,
            description: 'Test description',
        });
        const boardPage = new pageObjects.BoardPage(page, board.uuid);
        await boardPage.goto();
        await boardPage.taskByTitle(taskData.name).click();
        const taskDetails = new pageObjects.TaskDetails(boardPage.page);
        await use({ boardPage, taskData, boardData, taskDetails });
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },
    taskDetails: async ({ apiUtils, page, pageObjects }, use) => {
        const boardName = `Test ${Math.floor(Math.random() * 10 ** 10)}`;
        const board = await apiUtils.createBoard({
            name: boardName,
            columns: [
                { name: 'First', color: '#FFF000', position: 0 },
                { name: 'Second', color: '#000FFF', position: 1 },
            ],
        });
        const boardData = await apiUtils.getBoard(board.uuid);
        const taskData = await apiUtils.createTask({
            name: 'Test task',
            column_uuid: boardData.columns[1].uuid,
        });
        const boardPage = new pageObjects.BoardPage(page, board.uuid);
        await boardPage.goto();
        await boardPage.taskByTitle(taskData.name).click();
        const taskDetails = new pageObjects.TaskDetails(boardPage.page);
        await use({ taskData, taskDetails });
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },
});

test.describe('Task details screen', () => {
    test('Modal contains task data', async ({ taskDetailsWithSubtasks: { taskData, boardData, taskDetails } }) => {
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.optionsBtn).toBeVisible();
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.subtaskRows).toHaveCount(3);
        await expect(taskDetails.statusDropdown).toHaveValue(boardData.columns[0].name);
    });

    test('Subtask status can be toggled', async ({ taskDetailsWithSubtasks: { taskDetails } }) => {
        await expect(taskDetails.nthSubtaskCheckbox(0)).not.toBeChecked();
        await taskDetails.clickNthSubtask(0);
        await expect(taskDetails.nthSubtaskCheckbox(0)).toBeChecked();
        await taskDetails.clickNthSubtask(0);
        await expect(taskDetails.nthSubtaskCheckbox(0)).not.toBeChecked();
    });

    test('Subtask count is updated', async ({ taskDetailsWithSubtasks: { taskDetails } }) => {
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (0 of 3)');
        await taskDetails.clickNthSubtask(0);
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (1 of 3)');
        await taskDetails.clickNthSubtask(1);
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (2 of 3)');
        await taskDetails.clickNthSubtask(2);
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (3 of 3)');
        await taskDetails.clickNthSubtask(0);
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (2 of 3)');
        await taskDetails.clickNthSubtask(1);
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (1 of 3)');
        await taskDetails.clickNthSubtask(2);
        await expect(taskDetails.subtasksHeader).toHaveText('Subtasks (0 of 3)');
    });

    test('Fields without values are not displayed', async ({ taskDetails: { taskDetails } }) => {
        await expect(taskDetails.name).toBeVisible(); // Ensure that the modal is open before checking for other fields
        await expect(taskDetails.description).not.toBeVisible();
        await expect(taskDetails.subtasksHeader).not.toBeVisible();
    });

    test('Task can be moved to another column', async ({
        taskDetailsWithSubtasks: { boardPage, taskDetails, taskData, boardData },
    }) => {
        await expect(boardPage.taskByTitle(taskData.name, 'First')).toBeVisible();
        await boardPage.page.waitForTimeout(2000);
        await taskDetails.statusDropdown.selectOption(boardData.columns[1].name);
        await expect(taskDetails.statusDropdown).toHaveValue(boardData.columns[1].name);
        // Confirm that the task is moved to the new column
        await expect(boardPage.taskByTitle(taskData.name, 'First')).not.toBeVisible();
        await expect(boardPage.taskByTitle(taskData.name, 'Second')).toBeVisible();
    });

    test('Task can be deleted', async ({
        taskDetailsWithSubtasks: { boardPage, taskDetails, taskData },
        pageObjects,
        request,
    }) => {
        await taskDetails.optionsBtn.click();
        await taskDetails.deleteBtn.click();
        const deleteModal = new pageObjects.DeleteModal(boardPage.page);
        await expect(deleteModal.header).toHaveText('Delete this task?');
        await expect(deleteModal.message).toHaveText(
            `Are you sure you want to delete the ‘${taskData.name}’ task? This action cannot be reversed.`
        );
        await deleteModal.deleteBtn.click();
        await expect(deleteModal.rootElement).not.toBeVisible();
        await expect(taskDetails.rootElement).not.toBeVisible();
        await expect(boardPage.taskByTitle(taskData.name)).not.toBeVisible();
        const response = await request.get(`/api/tasks/${taskData.uuid}`);
        expect(response.status()).toBe(404);
    });

    test('Task Details modal is hidden while Delete modal is visible', async ({
        taskDetailsWithSubtasks: { boardPage, taskDetails },
        pageObjects,
    }) => {
        await taskDetails.optionsBtn.click();
        await taskDetails.deleteBtn.click();
        const deleteModal = new pageObjects.DeleteModal(boardPage.page);
        await expect(deleteModal.rootElement).toBeVisible();
        await expect(taskDetails.rootElement).not.toBeVisible();
        await deleteModal.cancelBtn.click();
        await expect(deleteModal.rootElement).not.toBeVisible();
        await expect(taskDetails.rootElement).toBeVisible();
    });
});
