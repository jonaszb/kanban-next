import { test, expect } from '../../fixtures';
import { v4 as uuidv4 } from 'uuid';

test.describe('/boards', () => {
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
});
