import { test as base, expect } from '../../fixtures';
import { Task } from '../../types';
import type TaskDetails from '../pageObjects/TaskDetails';
import TaskForm from '../pageObjects/TaskForm';

const test = base.extend<{
    taskDetailsModal: {
        taskData: Task;
        taskDetails: TaskDetails;
    };
    editTaskModal: {
        taskData: Task;
        taskForm: TaskForm;
        taskDetails: TaskDetails;
    };
}>({
    taskDetailsModal: async ({ apiUtils, page, pageObjects }, use) => {
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
            description: 'Test description',
            subtasks: [{ name: 'First' }],
            column_uuid: boardData.columns[1].uuid,
        });
        const boardPage = new pageObjects.BoardPage(page, board.uuid);
        await boardPage.goto();
        await boardPage.taskByTitle(taskData.name).click();
        const taskDetails = new pageObjects.TaskDetails(boardPage.page);
        await use({ taskData, taskDetails });
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },
    editTaskModal: async ({ taskDetailsModal, pageObjects }, use) => {
        const { taskDetails, taskData } = taskDetailsModal;
        await taskDetails.editTask();
        const taskForm = new pageObjects.TaskForm(taskDetails.page);
        await use({ taskData, taskForm, taskDetails });
    },
});

test.describe('Edit Task screen', () => {
    test('Fields should contain current task data', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await expect(taskDetails.rootElement).toBeHidden();
        await expect(taskForm.title).toHaveValue(taskData.name);
        await expect(taskForm.description).toHaveValue(taskData.description);
        await expect(taskForm.statusDropdown).toHaveValue('Second');
        await expect(taskForm.nthSubtaskInput(0)).toHaveValue('First');
    });

    test('Should be able to edit task name', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.title.fill('Edited task name');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText('Edited task name');
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('First');
    });

    test('Should be able to edit task description', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.description.fill('Edited task description');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText('Edited task description');
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('First');
    });

    test('Should be able to remove task description', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.description.fill('');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toBeHidden();
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('First');
    });

    test('Should be able to edit task status', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.statusDropdown.selectOption('First');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('First');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('First');
    });

    test('Should be able to edit existing subtasks', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.nthSubtaskInput(0).fill('Edited subtask');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('Edited subtask');
        await expect(taskDetails.nthSubtaskCheckbox(0)).not.toBeChecked();
    });

    test("Editing the subtask name doesn't affect its status", async ({ taskDetailsModal, pageObjects }) => {
        const { taskData, taskDetails } = taskDetailsModal;
        await taskDetails.clickNthSubtask(0);
        await taskDetails.editTask();
        const taskForm = new pageObjects.TaskForm(taskDetails.page);

        await taskForm.nthSubtaskInput(0).fill('Edited subtask');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('Edited subtask');
        await expect(taskDetails.nthSubtaskCheckbox(0)).toBeChecked();
    });

    test('Subtask can be replaced', async ({ taskDetailsModal, pageObjects }) => {
        const { taskData, taskDetails } = taskDetailsModal;
        await taskDetails.clickNthSubtask(0);

        await taskDetails.editTask();
        const taskForm = new pageObjects.TaskForm(taskDetails.page);

        // await expect(taskForm.subtaskRows).toHaveCount(1);
        await taskForm.nthSubtaskDeleteBtn(0).click();
        await expect(taskForm.subtaskRows).toHaveCount(0);
        await taskForm.addSubtaskBtn.click();
        await taskForm.nthSubtaskInput(0).fill('First');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('First');
        await expect(taskDetails.nthSubtaskCheckbox(0)).not.toBeChecked();
    });

    test('Should be able to add new subtasks', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.addSubtaskBtn.click();
        await taskForm.nthSubtaskInput(1).fill('Second');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('First');
        await expect(taskDetails.nthSubtaskText(1)).toHaveText('Second');
        await expect(taskDetails.nthSubtaskCheckbox(0)).not.toBeChecked();
        await expect(taskDetails.nthSubtaskCheckbox(1)).not.toBeChecked();
    });

    test('Should be able to remove subtasks', async ({ editTaskModal }) => {
        const { taskData, taskForm, taskDetails } = editTaskModal;

        await taskForm.nthSubtaskDeleteBtn(0).click();
        await expect(taskForm.subtaskRows).toHaveCount(0);
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText(taskData.name);
        await expect(taskDetails.description).toHaveText(taskData.description);
        await expect(taskDetails.statusDropdown).toHaveValue('Second');
        await expect(taskDetails.subtaskRows).toHaveCount(0);
    });

    test('Should be able to edit multiple fields at once', async ({ editTaskModal }) => {
        const { taskForm, taskDetails } = editTaskModal;

        await taskForm.title.fill('Edited name');
        await taskForm.description.fill('Edited description');
        await taskForm.statusDropdown.selectOption('First');
        await taskForm.nthSubtaskInput(0).fill('Second');
        await taskForm.submitBtn.click();

        await expect(taskForm.rootElement).toBeHidden();
        await expect(taskDetails.rootElement).toBeVisible();
        await expect(taskDetails.name).toHaveText('Edited name');
        await expect(taskDetails.description).toHaveText('Edited description');
        await expect(taskDetails.statusDropdown).toHaveValue('First');
        await expect(taskDetails.nthSubtaskText(0)).toHaveText('Second');
        await expect(taskDetails.nthSubtaskCheckbox(0)).not.toBeChecked();
    });
});
