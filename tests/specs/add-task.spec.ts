import { test as base, expect } from '../../fixtures';
import { Board } from '../../types';
import BoardPage from '../pageObjects/BoardPage';
import TaskForm from '../pageObjects/TaskForm';

const test = base.extend<{ addTaskModal: [TaskForm, Board]; boardPageWithData: [BoardPage, Board] }>({
    addTaskModal: async ({ boardPageWithColumn: [boardPage, boardData], pageObjects }, use) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await use([taskModal, boardData]);
    },

    boardPageWithData: async ({ testBoardWithData, page, pageObjects }, use) => {
        const boardPage = new pageObjects.BoardPage(page, testBoardWithData.uuid);
        await boardPage.goto();
        await use([boardPage, testBoardWithData]);
    },
});

test.describe('Add task', () => {
    test('Add Task button is disabled if no board is selected', async ({ basePage }) => {
        await expect(basePage.newTaskBtn).toBeDisabled();
    });

    test('Add Task button is disabled if selected board has no columns', async ({ boardPage: [boardPage] }) => {
        await expect(boardPage.newTaskBtn).toBeDisabled();
    });

    test('Add Task button opens the modal', async ({ boardPageWithColumn: [boardPage, boardData], pageObjects }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await expect(taskModal.rootElement).toBeVisible();
        await expect(taskModal.header).toHaveText('Add New Task');
        await expect(taskModal.title).toBeVisible();
        await expect(taskModal.description).toBeVisible();
        await expect(taskModal.subtaskRows).toHaveCount(0);
        await expect(taskModal.addSubtaskBtn).toBeVisible();
        await expect(taskModal.statusDropdown).toBeVisible();
        // Dropdown value should default to first column
        await expect(taskModal.statusDropdown).toHaveValue(boardData.columns[0].name);
    });

    test('New task can be created with title only', async ({ boardPageWithColumn: [boardPage], pageObjects }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.title.fill('Test task');
        await taskModal.submitBtn.click();
        await expect(taskModal.rootElement).not.toBeVisible();
        await expect(boardPage.taskByTitle('Test task')).toBeVisible();
        await expect(boardPage.taskByTitle('Test task')).not.toContainText('subtasks');
    });

    test('Task cannot be created without a title', async ({ boardPageWithColumn: [boardPage], pageObjects }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.submitBtn.click();
        await expect(taskModal.fieldError('Title')).toHaveText("Can't be empty");
    });

    test('Task cannot be created with a title over 100 characters', async ({
        boardPageWithColumn: [boardPage],
        pageObjects,
    }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.title.fill('a'.repeat(101));
        await taskModal.submitBtn.click();
        await expect(taskModal.fieldError('Title')).toHaveText('101/100');
    });

    test('Task cannot be added with blank subtasks', async ({ boardPageWithColumn: [boardPage], pageObjects }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.addSubtaskBtn.click();
        await taskModal.submitBtn.click();
        await expect(taskModal.fieldError('Subtasks', 0)).toHaveText("Can't be empty");
    });

    test('Task cannot be added with subtasks over 100 characters', async ({
        boardPageWithColumn: [boardPage],
        pageObjects,
    }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.title.fill('test');
        await taskModal.addSubtaskBtn.click();
        await taskModal.nthSubtaskInput(0).fill('a'.repeat(101));
        await taskModal.submitBtn.click();
        await expect(taskModal.fieldError('Subtasks', 0)).toHaveText('101/100');
    });

    test('Task can be created in a specific column', async ({ boardPageWithData, pageObjects }) => {
        const [boardPage, boardData] = boardPageWithData;
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.title.fill('Test task');
        await taskModal.statusDropdown.selectOption(boardData.columns[1].name);
        await taskModal.submitBtn.click();
        await expect(taskModal.rootElement).not.toBeVisible();
        await expect(boardPage.taskByTitle('Test task', boardData.columns[1].name)).toBeVisible();
    });

    test('New task is placed at the bottom of the column', async ({ boardPageWithData, pageObjects }) => {
        const [boardPage] = boardPageWithData;
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.title.fill('Last');
        await taskModal.submitBtn.click();
        await expect(boardPage.tasksInColumn(0).nth(1)).toHaveText('Last');
    });

    test('Task can be created with subtasks', async ({ boardPageWithColumn: [boardPage], pageObjects }) => {
        await boardPage.newTaskBtn.click();
        const taskModal = new pageObjects.TaskForm(boardPage.page);
        await taskModal.title.fill('Test task');
        await taskModal.addSubtaskBtn.click();
        await taskModal.nthSubtaskInput(0).fill('Test subtask 1');
        await taskModal.addSubtaskBtn.click();
        await taskModal.nthSubtaskInput(1).fill('Test subtask 2');
        await taskModal.submitBtn.click();
        await expect(taskModal.rootElement).not.toBeVisible();
        await expect(boardPage.taskByTitle('Test task')).toBeVisible();
        await expect(boardPage.taskByTitle('Test task')).toContainText('0 of 2 subtasks done');
    });
});
