import { test, expect } from '../../../fixtures';
import { v4 as uuidv4, validate } from 'uuid';
import { Column } from '../../../types';

test.describe('Columns CRUD tests', () => {
    test.describe('POST', () => {
        test('New column can be created', async ({ testBoard, request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'Auto test',
                    board_uuid: testBoard.uuid,
                    color: '#F0F00F',
                },
            });
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.name).toBe('Auto test');
            expect(column.position).toBe(0);
            expect(column.color).toBe('#F0F00F');
            expect(column.board_uuid).toBe(testBoard.uuid);
            expect(validate(column.uuid)).toBe(true);
        });

        test('New column can be created with position', async ({ testBoard, request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'Auto test',
                    board_uuid: testBoard.uuid,
                    color: '#F0F00F',
                    position: 0,
                },
            });
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.name).toBe('Auto test');
            expect(column.position).toBe(0);
            expect(column.color).toBe('#F0F00F');
            expect(column.board_uuid).toBe(testBoard.uuid);
            expect(validate(column.uuid)).toBe(true);
        });

        test('If position is not the highest, other columns are moved up', async ({
            testBoardWithData,
            request,
            apiUtils,
        }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'First',
                    board_uuid: testBoardWithData.uuid,
                    color: '#F0F00F',
                    position: 0,
                },
            });
            const newColumn = await response.json();
            expect(newColumn.position).toBe(0);
            const updatedColumn1 = await apiUtils.getColumn(testBoardWithData.columns[0].uuid);
            expect(updatedColumn1.position).toBe(1);
            const updatedColumn2 = await apiUtils.getColumn(testBoardWithData.columns[1].uuid);
            expect(updatedColumn2.position).toBe(2);
        });

        test('Column cannot be created without a name', async ({ testBoard, request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    color: '#FFFFFF',
                    board_uuid: testBoard.uuid,
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Column cannot be created without a color', async ({ testBoard, request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'Auto test',
                    board_uuid: testBoard.uuid,
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Column cannot be created without a board_uuid', async ({ request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'Auto test',
                    color: '#FFFFFF',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Column cannot be created with a name longer than 20 characters', async ({ testBoard, request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'Auto test with a long name',
                    board_uuid: testBoard.uuid,
                    color: '#FFFFFF',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Column cannot be created with invalid board UUID', async ({ testBoard, request }) => {
            const response = await request.post('/api/columns', {
                data: {
                    name: 'Auto test',
                    color: '#FFFFFF',
                    board_uuid: 'invalidUUID',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Column cannot be created if not logged in', async ({ testBoard, noAuthRequest }) => {
            const response = await noAuthRequest.post('/api/columns', {
                data: {
                    name: 'Auto test',
                    board_uuid: testBoard.uuid,
                    color: '#FFFFFF',
                },
            });
            expect(response.status()).toBe(401);
        });
    });

    test.describe('GET', () => {
        test('Columns can be retrieved', async ({ testBoardWithData, request }) => {
            const response = await request.get('/api/columns/');
            expect(response.status()).toBe(200);
            const columns: Column[] = await response.json();
            expect(columns).toBeInstanceOf(Array);
            expect(columns.find((col) => col.name === testBoardWithData.columns[0].name)).toBeDefined();
            expect(columns.find((col) => col.name === testBoardWithData.columns[1].name)).toBeDefined();
        });

        test('Specific column can be retrieved', async ({ testBoardWithData, request }) => {
            const response = await request.get(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.name).toBe(testBoardWithData.columns[0].name);
            expect(column.color).toBe(testBoardWithData.columns[0].color);
            expect(column.board_uuid).toBe(testBoardWithData.uuid);
        });

        test('Column cannot be retrieved with invalid board UUID', async ({ request }) => {
            const response = await request.get('/api/columns/invalidUUID');
            expect(response.status()).toBe(400);
        });

        test('Requesting a non-existent column returns 404', async ({ request }) => {
            const response = await request.get(`/api/columns/${uuidv4()}`);
            expect(response.status()).toBe(404);
        });

        test('Columns cannot be retrieved if not logged in', async ({ noAuthRequest }) => {
            const response = await noAuthRequest.get('/api/columns/');
            expect(response.status()).toBe(401);
        });

        test('Specific column cannot be retrieved if not logged in', async ({ testBoardWithData, noAuthRequest }) => {
            const response = await noAuthRequest.get(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(401);
        });

        test('Column belonging to another user cannot be retrieved', async ({ testBoardWithData, altRequest }) => {
            const response = await altRequest.get(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(404);
        });
    });

    test.describe('DELETE', () => {
        test('Column can be deleted', async ({ testBoardWithData, request }) => {
            const response = await request.delete(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(200);
            const colResponse = await request.get(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(colResponse.status()).toBe(404);
        });

        test('Position of other columns is updated', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.delete(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(200);
            const colData = await apiUtils.getColumn(testBoardWithData.columns[1].uuid);
            expect(colData.position).toBe(0);
        });

        test('Column cannot be deleted with invalid board UUID', async ({ request }) => {
            const response = await request.delete('/api/columns/invalidUUID');
            expect(response.status()).toBe(400);
        });

        test('Deleting a non-existent column returns 404', async ({ request }) => {
            const response = await request.delete(`/api/columns/${uuidv4()}`);
            expect(response.status()).toBe(404);
        });

        test('Column cannot be deleted if not logged in', async ({ testBoardWithData, noAuthRequest }) => {
            const response = await noAuthRequest.delete(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(401);
        });

        test('Column belonging to another user cannot be deleted', async ({ testBoardWithData, altRequest }) => {
            const response = await altRequest.delete(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            expect(response.status()).toBe(404);
        });
    });

    test.describe('PUT', () => {
        test('Column name can be updated', async ({ testBoardWithData, request }) => {
            const response = await request.put(`/api/columns/${testBoardWithData.columns[0].uuid}`, {
                data: {
                    name: 'Updated name',
                },
            });
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.name).toBe('Updated name');
            // Other fields should not be updated
            expect(column.color).toBe(testBoardWithData.columns[0].color);
            expect(column.board_uuid).toBe(testBoardWithData.uuid);
            expect(column.position).toBe(testBoardWithData.columns[0].position);
            expect(column.uuid).toBe(testBoardWithData.columns[0].uuid);
            expect(column.id).toBe(testBoardWithData.columns[0].id);
        });

        test('Column color can be updated', async ({ testBoardWithData, request }) => {
            const response = await request.put(`/api/columns/${testBoardWithData.columns[0].uuid}`, {
                data: {
                    color: '#000000',
                },
            });
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.color).toBe('#000000');
            // Other fields should not be updated
            expect(column.name).toBe(testBoardWithData.columns[0].name);
            expect(column.board_uuid).toBe(testBoardWithData.uuid);
            expect(column.position).toBe(testBoardWithData.columns[0].position);
            expect(column.uuid).toBe(testBoardWithData.columns[0].uuid);
            expect(column.id).toBe(testBoardWithData.columns[0].id);
        });

        test('Column position can be updated (increase)', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.put(`/api/columns/${testBoardWithData.columns[0].uuid}`, {
                data: {
                    position: 1,
                },
            });
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.position).toBe(1);
            // Other fields should not be updated
            expect(column.name).toBe(testBoardWithData.columns[0].name);
            expect(column.color).toBe(testBoardWithData.columns[0].color);
            expect(column.board_uuid).toBe(testBoardWithData.uuid);
            expect(column.uuid).toBe(testBoardWithData.columns[0].uuid);
            expect(column.id).toBe(testBoardWithData.columns[0].id);
            // Position of other columns should be updated
            const otherColumn = await apiUtils.getColumn(testBoardWithData.columns[1].uuid);
            expect(otherColumn.position).toBe(0);
        });

        test('Column position can be updated (descrease)', async ({ testBoardWithData, request, apiUtils }) => {
            const response = await request.put(`/api/columns/${testBoardWithData.columns[1].uuid}`, {
                data: {
                    position: 0,
                },
            });
            expect(response.status()).toBe(200);
            const column = await response.json();
            expect(column.position).toBe(0);
            // Other fields should not be updated
            expect(column.name).toBe(testBoardWithData.columns[1].name);
            expect(column.color).toBe(testBoardWithData.columns[1].color);
            expect(column.board_uuid).toBe(testBoardWithData.uuid);
            expect(column.uuid).toBe(testBoardWithData.columns[1].uuid);
            expect(column.id).toBe(testBoardWithData.columns[1].id);
            // Position of other columns should be updated
            const otherColumn = await apiUtils.getColumn(testBoardWithData.columns[0].uuid);
            expect(otherColumn.position).toBe(1);
        });

        test('Column cannot be updated with invalid board UUID', async ({ request }) => {
            const response = await request.put('/api/columns/invalidUUID', {
                data: {
                    name: 'Updated name',
                },
            });
            expect(response.status()).toBe(400);
        });

        test('Updating a non-existent column returns 404', async ({ request }) => {
            const response = await request.put(`/api/columns/${uuidv4()}`, {
                data: {
                    name: 'Updated name',
                },
            });
            expect(response.status()).toBe(404);
        });

        test('Columns are deleted if related board is deleted', async ({ testBoardWithData, request, apiUtils }) => {
            await apiUtils.deleteBoard(testBoardWithData.uuid);
            const response1 = await request.get(`/api/columns/${testBoardWithData.columns[0].uuid}`);
            const response2 = await request.get(`/api/columns/${testBoardWithData.columns[1].uuid}`);
            expect(response1.status()).toBe(404);
            expect(response2.status()).toBe(404);
        });

        test('Column cannot be updated if not logged in', async ({ testBoardWithData, noAuthRequest }) => {
            const response = await noAuthRequest.put(`/api/columns/${testBoardWithData.columns[0].uuid}`, {
                data: {
                    name: 'Updated name',
                },
            });
            expect(response.status()).toBe(401);
        });

        test('Cannot update column belonging to another user', async ({ testBoardWithData, altRequest }) => {
            const response = await altRequest.put(`/api/columns/${testBoardWithData.columns[0].uuid}`, {
                data: {
                    name: 'Updated name',
                },
            });
            expect(response.status()).toBe(404);
        });
    });
});
