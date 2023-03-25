import { test, expect } from '../../../fixtures';
import { v4 as uuidv4 } from 'uuid';

test.describe('Boards CRUD tests', () => {
    test.describe('GET', () => {
        test('GET all boards', async ({ testBoard, apiUtils }) => {
            const allBoards = await apiUtils.getBoards();
            expect(allBoards).toBeInstanceOf(Array);
            expect(allBoards).toContainEqual({ ...testBoard, columns: [] });
        });

        test('GET a single board', async ({ testBoard, apiUtils }) => {
            const board = await apiUtils.getBoard(testBoard.uuid);
            expect(board).toEqual({ ...testBoard, columns: [] });
        });

        test('GET a single board - 404 if non-existent', async ({ apiUtils }) => {
            const response = await apiUtils.getBoard(uuidv4(), { rawResponse: true });
            expect(response.status()).toBe(404);
        });

        test('GET a single board - 400 if invalid uuid', async ({ apiUtils }) => {
            const response = await apiUtils.getBoard('notUUID', { rawResponse: true });
            expect(response.status()).toBe(400);
        });

        test('GET a single board - 401 if not logged in', async ({ testBoard, noAuthRequest }) => {
            const response = await noAuthRequest.get(`/api/boards/${testBoard.uuid}`, { failOnStatusCode: false });
            expect(response.status()).toBe(401);
        });

        test('GET all boards - 401 if not logged in', async ({ noAuthRequest }) => {
            const response = await noAuthRequest.get('/api/boards', { failOnStatusCode: false });
            expect(response.status()).toBe(401);
        });

        test('GET board belonging to another user - 404', async ({ testBoard, altRequest }) => {
            const response = await altRequest.get(`/api/boards/${testBoard.uuid}`, { failOnStatusCode: false });
            expect(response.status()).toBe(404);
        });
    });

    test.describe('DELETE', () => {
        test('DELETE a board', async ({ testBoard, apiUtils }) => {
            const response = await apiUtils.deleteBoard(testBoard.uuid);
            expect(response.status()).toBe(200);
        });

        test('DELETE a board - 404 if non-existent', async ({ apiUtils }) => {
            const response = await apiUtils.deleteBoard(uuidv4(), { failOnStatusCode: false });
            expect(response.status()).toBe(404);
        });

        test('DELETE a board - 400 if invalid uuid', async ({ apiUtils }) => {
            const response = await apiUtils.deleteBoard('notUUID', { failOnStatusCode: false });
            expect(response.status()).toBe(400);
        });

        test('DELETE a board - 401 if not logged in', async ({ testBoard, noAuthRequest }) => {
            const response = await noAuthRequest.delete(`/api/boards/${testBoard.uuid}`, { failOnStatusCode: false });
            expect(response.status()).toBe(401);
        });

        test('DELETE a board belonging to another user - 404', async ({ testBoard, altRequest }) => {
            const response = await altRequest.delete(`/api/boards/${testBoard.uuid}`, { failOnStatusCode: false });
            expect(response.status()).toBe(404);
        });
    });

    test.describe('POST', () => {
        test('POST a board - new board can be created', async ({ apiUtils }) => {
            const response = await apiUtils.createBoard({ name: 'Test board' }, { rawResponse: true });
            expect(response.status()).toBe(201);
            const board = await response.json();
            expect.soft(board).toHaveProperty('uuid');
            expect.soft(board).toHaveProperty('name', 'Test board');
            await apiUtils.deleteBoard(board.uuid);
        });

        test('POST a board - 400 if invalid body', async ({ request }) => {
            const response = await request.post('/api/boards', {
                data: { invalidKey: 'test' },
                failOnStatusCode: false,
            });
            expect(response.status()).toBe(400);
        });

        test('POST a board - unexpected fields are ignored', async ({ request, apiUtils }) => {
            const response = await request.post('/api/boards', {
                data: { invalidKey: 'test', name: 'validName' },
                failOnStatusCode: false,
            });
            expect(response.status()).toBe(201);
            const board = await response.json();
            expect.soft(board).toHaveProperty('name', 'validName');
            expect.soft(board).not.toHaveProperty('invalidKey');
            await apiUtils.deleteBoard(board.uuid);
        });

        test('POST a board - 400 if name is too short', async ({ apiUtils }) => {
            const response = await apiUtils.createBoard({ name: '' }, { rawResponse: true });
            expect(response.status()).toBe(400);
        });

        test('POST a board - 400 if name is too long', async ({ apiUtils }) => {
            const response = await apiUtils.createBoard({ name: 'a'.repeat(31) }, { rawResponse: true });
            expect(response.status()).toBe(400);
        });

        test('POST a board - 401 if not logged in', async ({ noAuthRequest }) => {
            const response = await noAuthRequest.post('/api/boards', {
                failOnStatusCode: false,
                data: {
                    name: 'Test board',
                },
            });
            expect(response.status()).toBe(401);
        });
    });
});
