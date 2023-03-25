import { test as base, expect } from '../../../fixtures';
import { v4 as uuidv4, validate } from 'uuid';
import { Task } from '../../../types';

const test = base.extend({
    testColumn: async ({ testBoard, apiUtils }, use) => {
        const column = await apiUtils.createColumn({
            name: 'Test column',
            board_uuid: testBoard.uuid,
            color: '#000000',
        });
        await apiUtils.createTask({
            name: 'Test task 1',
            subtasks: [{ name: 'Subtask 1' }, { name: 'Subtask 2' }],
            column_uuid: column.uuid,
        });
        await apiUtils.createTask({
            name: 'Test task 2',
            description: 'Test description',
            subtasks: [{ name: 'Subtask 3' }],
            column_uuid: column.uuid,
        });
        await apiUtils.createTask({
            name: 'Test task 3',
            column_uuid: column.uuid,
        });
        const columnData = await apiUtils.getColumn(column.uuid);
        await use(columnData);
    },
});

test.describe('Tasks CRUD tests', () => {
    test.describe('POST', () => {
        test('New task can be created', async ({ testBoardWithColumn: testBoard, request }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test creating tasks',
                    column_uuid: testBoard.columns[0].uuid,
                },
            });
            expect(response.status()).toBe(201);
            const task = await response.json();
            expect(task.name).toBe('Test creating tasks');
            expect(task.column_uuid).toBe(testBoard.columns[0].uuid);
            expect(validate(task.uuid)).toBe(true);
        });

        test('New task can be created with subtasks', async ({ testBoardWithColumn: testBoard, request, apiUtils }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test creating tasks',
                    column_uuid: testBoard.columns[0].uuid,
                    subtasks: [{ name: 'Subtask 1' }, { name: 'Subtask 2' }],
                },
            });
            expect(response.status()).toBe(201);
            const task = await apiUtils.getTask((await response.json()).uuid);
            expect(task.subtasks).toBeInstanceOf(Array);
            expect(task.subtasks.length).toBe(2);
            expect(task.subtasks[0].name).toBe('Subtask 1');
            expect(task.subtasks[1].name).toBe('Subtask 2');
            expect(validate(task.subtasks[0].uuid)).toBe(true);
            expect(validate(task.subtasks[1].uuid)).toBe(true);
            // Verify subtasks are not completed by default
            expect(task.subtasks[0].completed).toBe(false);
            expect(task.subtasks[1].completed).toBe(false);
        });

        test('Task can have a description', async ({ testBoardWithColumn: testBoard, request }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test',
                    column_uuid: testBoard.columns[0].uuid,
                    description: 'This is a test description',
                },
            });
            expect(response.status()).toBe(201);
            const task = await response.json();
            expect(task.description).toBe('This is a test description');
        });

        test('New task will always be placed in the last position', async ({
            testBoardWithData: testBoard,
            request,
            apiUtils,
        }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test',
                    column_uuid: testBoard.columns[0].uuid,
                    position: 0,
                },
            });
            expect(response.status()).toBe(201);
            const task = await response.json();
            expect(task.position).toBe(1);
            const otherTask = await apiUtils.getTask(testBoard.columns[0].tasks[0].uuid);
            expect(otherTask.position).toBe(0);
        });

        test('Task cannot be created without a name', async ({ testBoardWithColumn: testBoard, request }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    column_uuid: testBoard.columns[0].uuid,
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task cannot be created without a column', async ({ request }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task cannot be created with a column that does not exist', async ({ request }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test',
                    column_uuid: uuidv4(),
                },
            });
            expect(response.status()).toBe(404);
        });

        test('Task cannot be created with an invalid column', async ({ request }) => {
            const response = await request.post('/api/tasks', {
                data: {
                    name: 'Test',
                    column_uuid: 'invalid',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task cannot be created if not logged in', async ({ testBoardWithColumn: testBoard, noAuthRequest }) => {
            const response = await noAuthRequest.post('/api/tasks', {
                data: {
                    name: 'Test',
                    column_uuid: testBoard.columns[0].uuid,
                },
            });
            expect(response.status()).toBe(401);
        });
    });

    test.describe('GET', () => {
        test('Tasks can be retrieved', async ({ testBoardWithData, request }) => {
            const response = await request.get('/api/tasks');
            expect(response.status()).toBe(200);
            const tasks: Task[] = await response.json();
            expect(tasks).toBeInstanceOf(Array);
            expect(tasks.find((task) => task.name === testBoardWithData.columns[0].tasks[0].name)).toBeDefined();
        });

        test('Task can be retrieved', async ({ testBoardWithData, request }) => {
            const response = await request.get(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(response.status()).toBe(200);
            const task = await response.json();
            expect(task.name).toBe(testBoardWithData.columns[0].tasks[0].name);
        });

        test('Task cannot be retrieved if it does not exist', async ({ request }) => {
            const response = await request.get(`/api/tasks/${uuidv4()}`);
            expect(response.status()).toBe(404);
        });

        test('Task cannot be retrieved with an invalid uuid', async ({ request }) => {
            const response = await request.get('/api/tasks/invalid');
            expect(response.status()).toBe(400);
        });

        test('Tasks cannot be retrieved if not logged in', async ({ noAuthRequest }) => {
            const response = await noAuthRequest.get(`/api/tasks`);
            expect(response.status()).toBe(401);
        });

        test('Specific task cannot be retrieved if not logged in', async ({ testBoardWithData, noAuthRequest }) => {
            const response = await noAuthRequest.get(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(response.status()).toBe(401);
        });

        test('Cannot retrieve a task belonging to another user', async ({ testBoardWithData, altRequest }) => {
            const response = await altRequest.get(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(response.status()).toBe(404);
        });
    });

    test.describe('DELETE', () => {
        test('task can be deleted', async ({ testBoardWithData, request }) => {
            const response = await request.delete(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(response.status()).toBe(200);
            const taskResponse = await request.get(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(taskResponse.status()).toBe(404);
        });

        test('task cannot be deleted if it does not exist', async ({ request }) => {
            const response = await request.delete(`/api/tasks/${uuidv4()}`);
            expect(response.status()).toBe(404);
        });

        test('task cannot be deleted with an invalid uuid', async ({ request }) => {
            const response = await request.delete('/api/tasks/invalid');
            expect(response.status()).toBe(400);
        });

        test('task cannot be deleted if not logged in', async ({ testBoardWithData, noAuthRequest }) => {
            const response = await noAuthRequest.delete(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(response.status()).toBe(401);
        });

        test('Cannot delete a task belonging to another user', async ({ testBoardWithData, altRequest }) => {
            const response = await altRequest.delete(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`);
            expect(response.status()).toBe(404);
        });
    });

    test.describe('PUT', () => {
        test('Task name can be updated', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.put(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`, {
                data: {
                    name: 'New name',
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testBoardWithData.columns[0].tasks[0].uuid);
            expect(task.name).toBe('New name');
        });

        test('Task description can be updated', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.put(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`, {
                data: {
                    description: 'New description',
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testBoardWithData.columns[0].tasks[0].uuid);
            expect(task.description).toBe('New description');
        });

        test('Task description can be made empty', async ({ testColumn, request, apiUtils }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[1].uuid}`, {
                data: {
                    description: '',
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testColumn.tasks[1].uuid);
            expect(task.description).toBe('');
        });

        test('Task column can be updated', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.put(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`, {
                data: {
                    column_uuid: testBoardWithData.columns[1].uuid,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testBoardWithData.columns[0].tasks[0].uuid);
            expect(task.column_uuid).toBe(testBoardWithData.columns[1].uuid);
            // Position was not specified, so it should be placed at the end
            expect(task.position).toBe(1);
        });

        test('Task column can be updated (specified position)', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.put(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`, {
                data: {
                    column_uuid: testBoardWithData.columns[1].uuid,
                    position: 0,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testBoardWithData.columns[0].tasks[0].uuid);
            const task2 = await apiUtils.getTask(testBoardWithData.columns[1].tasks[0].uuid);
            expect(task.column_uuid).toBe(testBoardWithData.columns[1].uuid);
            expect(task.position).toBe(0);
            expect(task2.position).toBe(1); // Position that was previously first was moved up
        });

        test('Task column can be updated (specified position, out of bounds)', async ({
            testBoardWithData,
            request,
            apiUtils,
        }) => {
            const response = await request.put(`/api/tasks/${testBoardWithData.columns[0].tasks[0].uuid}`, {
                data: {
                    column_uuid: testBoardWithData.columns[1].uuid,
                    position: 2,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testBoardWithData.columns[0].tasks[0].uuid);
            expect(task.column_uuid).toBe(testBoardWithData.columns[1].uuid);
            expect(task.position).toBe(1); // Position was out of bounds, so it should be placed at the end
        });

        test('Task position can be updated within the same column (same position)', async ({
            testColumn,
            request,
            apiUtils,
        }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    position: 0,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            expect(task.position).toBe(0);
        });

        test('Task position can be updated within the same column (higher position)', async ({
            testColumn,
            request,
            apiUtils,
        }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    position: 1,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            expect(task.position).toBe(1);
            // Check if other tasks were repositioned correctly
            const task2 = await apiUtils.getTask(testColumn.tasks[1].uuid);
            expect(task2.position).toBe(0);
            const task3 = await apiUtils.getTask(testColumn.tasks[2].uuid);
            expect(task3.position).toBe(2);
        });

        test('Task position can be updated within the same column (lower position)', async ({
            testColumn,
            request,
            apiUtils,
        }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[1].uuid}`, {
                data: {
                    position: 0,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testColumn.tasks[1].uuid);
            expect(task.position).toBe(0);
            // Check if other tasks were repositioned correctly
            const task2 = await apiUtils.getTask(testColumn.tasks[0].uuid);
            expect(task2.position).toBe(1);
            const task3 = await apiUtils.getTask(testColumn.tasks[2].uuid);
            expect(task3.position).toBe(2);
        });

        test('Task position can be updated within the same column (out of bounds)', async ({
            testColumn,
            request,
            apiUtils,
        }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[1].uuid}`, {
                data: {
                    position: 3,
                },
            });
            expect(response.status()).toBe(200);
            const task = await apiUtils.getTask(testColumn.tasks[1].uuid);
            expect(task.position).toBe(2);
            // Check if other tasks were repositioned correctly
            const task2 = await apiUtils.getTask(testColumn.tasks[0].uuid);
            expect(task2.position).toBe(0);
            const task3 = await apiUtils.getTask(testColumn.tasks[2].uuid);
            expect(task3.position).toBe(1);
        });

        test('New subtasks can be added', async ({ testColumn, request, apiUtils }) => {
            let task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            const response = await request.put(`/api/tasks/${task.uuid}`, {
                data: {
                    subtasks: [
                        ...task.subtasks,
                        {
                            name: 'Subtask 3',
                        },
                    ],
                },
            });
            expect(response.status()).toBe(200);
            task = await apiUtils.getTask(task.uuid);
            expect(task.subtasks.length).toBe(3);
            expect(task.subtasks[0].name).toBe('Subtask 1');
            expect(task.subtasks[1].name).toBe('Subtask 2');
            expect(task.subtasks[2].name).toBe('Subtask 3');
        });

        test('Status of existing subtasks is not affected when adding subtasks', async ({
            testColumn,
            request,
            apiUtils,
        }) => {
            let task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            await apiUtils.updateSubtask(task.subtasks[0].uuid, { completed: true });
            const response = await request.put(`/api/tasks/${task.uuid}`, {
                data: {
                    subtasks: [
                        ...task.subtasks,
                        {
                            name: 'Subtask 3',
                        },
                    ],
                },
            });
            expect(response.status()).toBe(200);
            task = await apiUtils.getTask(task.uuid);
            expect(task.subtasks.length).toBe(3);
            expect(task.subtasks[0].completed).toBe(true);
            expect(task.subtasks[1].completed).toBe(false);
            expect(task.subtasks[2].completed).toBe(false);
        });

        test('Existing subtasks can be renamed', async ({ testColumn, request, apiUtils }) => {
            let task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            await apiUtils.updateSubtask(task.subtasks[1].uuid, { completed: true });
            const response = await request.put(`/api/tasks/${task.uuid}`, {
                data: {
                    subtasks: [
                        { ...task.subtasks[0], name: 'Subtask 1 updated' },
                        { ...task.subtasks[1], name: 'Subtask 2 updated' },
                    ],
                },
            });
            expect(response.status()).toBe(200);
            task = await apiUtils.getTask(task.uuid);
            expect(task.subtasks.length).toBe(2);
            expect(task.subtasks[0].name).toBe('Subtask 1 updated');
            expect(task.subtasks[0].completed).toBe(false);
            expect(task.subtasks[1].name).toBe('Subtask 2 updated');
            expect(task.subtasks[1].completed).toBe(true); // Status should not be affected
        });

        test('Existing subtasks can be replaced', async ({ testColumn, request, apiUtils }) => {
            let task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            const response = await request.put(`/api/tasks/${task.uuid}`, {
                data: {
                    subtasks: [
                        {
                            name: 'Subtask 3',
                        },
                    ],
                },
            });
            expect(response.status()).toBe(200);
            task = await apiUtils.getTask(task.uuid);
            expect(task.subtasks.length).toBe(1);
            expect(task.subtasks[0].name).toBe('Subtask 3');
            expect(task.subtasks[0].completed).toBe(false);
        });

        test('Status of existing subtasks is not affected when replacing other subtasks', async ({
            testColumn,
            request,
            apiUtils,
        }) => {
            let task = await apiUtils.getTask(testColumn.tasks[0].uuid);
            await apiUtils.updateSubtask(task.subtasks[1].uuid, { completed: true });
            const response = await request.put(`/api/tasks/${task.uuid}`, {
                data: {
                    subtasks: [
                        task.subtasks[1],
                        {
                            name: 'Subtask 3',
                        },
                    ],
                },
            });
            expect(response.status()).toBe(200);
            task = await apiUtils.getTask(task.uuid);
            expect(task.subtasks.length).toBe(2);
            expect(task.subtasks[0].completed).toBe(true);
            expect(task.subtasks[0].name).toBe('Subtask 2');
            expect(task.subtasks[1].completed).toBe(false);
            expect(task.subtasks[1].name).toBe('Subtask 3');
        });

        test('Task position cannot be set to negative number', async ({ testColumn, request }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    position: -1,
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task position cannot be set to non-integer number', async ({ testColumn, request }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    position: 1.5,
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task position cannot be set to string', async ({ testColumn, request }) => {
            const response = await request.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    position: '1',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task cannot be updated if uuid is invalid', async ({ request }) => {
            const response = await request.put(`/api/tasks/invalid-uuid`, {
                data: {
                    name: 'New name',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Task cannot be updated if uuid does not exist', async ({ request }) => {
            const response = await request.put(`/api/tasks/${uuidv4()}`, {
                data: {
                    name: 'New name',
                },
            });
            expect(response.status()).toBe(404);
        });

        test('Task cannot be updated if not logged in', async ({ testColumn, noAuthRequest }) => {
            const response = await noAuthRequest.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    name: 'New name',
                },
            });
            expect(response.status()).toBe(401);
        });

        test('Cannot update a task belonging to another user', async ({ testColumn, altRequest }) => {
            const response = await altRequest.put(`/api/tasks/${testColumn.tasks[0].uuid}`, {
                data: {
                    name: 'New name',
                },
            });
            expect(response.status()).toBe(404);
        });
    });
});
