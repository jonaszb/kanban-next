import type { Coordinates } from '@dnd-kit/core/dist/types';
import type { Locator, Mouse } from '@playwright/test';
import { test as base, expect } from '../../fixtures';
import { Board } from '../../types';
import BoardPage from '../pageObjects/BoardPage';

const test = base.extend<{ boardPageWithData: [BoardPage, Board] }>({
    boardPageWithData: async ({ testBoardWithData, page, pageObjects }, use) => {
        const boardPage = new pageObjects.BoardPage(page, testBoardWithData.uuid);
        await boardPage.goto();
        await use([boardPage, testBoardWithData]);
    },
});

const isCoordinates = (obj: unknown): obj is Coordinates => {
    return typeof obj === 'object' && obj !== null && 'x' in obj && 'y' in obj;
};

const getCoordinates = async (element: Locator | Coordinates): Promise<Coordinates> => {
    if (isCoordinates(element)) {
        return element;
    }
    const rect = await element.boundingBox();
    if (!rect) throw new Error('Element rect is null');
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
};

/**
 * Drag and drop an element from one location to another. Use instead of Playwright's dragTo until it supports custom steps.
 * @param mouse Mouse object from Playwright
 * @param from Element to drag
 * @param to Target element or coordinates
 * @param options.steps Number of steps to take between the two points. Defaults to 40.
 * @param options.targetOffset Offset from the target element's center. Defaults to 0.
 */
async function drag(
    mouse: Mouse,
    from: Locator | Coordinates,
    to: Locator | Coordinates,
    options?: { steps?: number; targetOffset?: Coordinates }
): Promise<void> {
    const source = await getCoordinates(from);
    const target = await getCoordinates(to);
    if (options?.targetOffset) {
        target.x += options.targetOffset.x;
        target.y += options.targetOffset.y;
    }
    await mouse.move(source.x, source.y);
    await mouse.down();
    await new Promise((resolve) => setTimeout(resolve, 250));
    await mouse.move(target.x, target.y, { steps: options?.steps ?? 40 });
    await new Promise((resolve) => setTimeout(resolve, 150));
    await mouse.up();
}

test.describe('Task drag and drop', () => {
    test('Drag into another column below existing task', async ({ boardPageWithData }) => {
        const [boardPage, board] = boardPageWithData;
        const task = boardPage.taskByTitle(board.columns[0].tasks[0].name);
        const mouse = boardPage.page.mouse;
        const targetColumn = boardPage.columns.nth(1);
        await drag(mouse, task, targetColumn, { targetOffset: { x: 0, y: 75 } });
        await expect(boardPage.tasksInColumn(1)).toHaveText(['Task 2', 'Task 1']);
        await expect(boardPage.nthColumnHeader(0)).toHaveText('Column 1 (0)');
        await expect(boardPage.nthColumnHeader(1)).toHaveText('Column 2 (2)');
    });

    test('Drag into another column above existing task', async ({ boardPageWithData }) => {
        const [boardPage, board] = boardPageWithData;
        const task = boardPage.taskByTitle(board.columns[0].tasks[0].name);
        const mouse = boardPage.page.mouse;
        const targetColumn = boardPage.columns.nth(1);
        await drag(mouse, task, targetColumn);
        await expect(boardPage.tasksInColumn(1)).toHaveText(['Task 1', 'Task 2']);
        await expect(boardPage.nthColumnHeader(0)).toHaveText('Column 1 (0)');
        await expect(boardPage.nthColumnHeader(1)).toHaveText('Column 2 (2)');
    });

    test('Drag into another column with no tasks', async ({ boardPageWithColumn, apiUtils }) => {
        const [boardPage, board] = boardPageWithColumn;
        await apiUtils.createColumn({ board_uuid: board.uuid, name: 'Column 2', color: '#FFF000' });
        await apiUtils.createTask({ column_uuid: board.columns[0].uuid, name: 'Task 1' });
        await boardPage.goto();
        const task = boardPage.taskByTitle('Task 1');
        const mouse = boardPage.page.mouse;
        const targetColumn = boardPage.columns.nth(1);
        await drag(mouse, task, targetColumn);
        await expect(boardPage.tasksInColumn(1)).toHaveText(['Task 1']);
        await expect(boardPage.nthColumnHeader(0)).toHaveText('Column 1 (0)');
        await expect(boardPage.nthColumnHeader(1)).toHaveText('Column 2 (1)');
    });

    test('Drag up in the same column', async ({ boardPageWithColumn, apiUtils }) => {
        const [boardPage, board] = boardPageWithColumn;
        await apiUtils.createTask({ column_uuid: board.columns[0].uuid, name: 'Task 1' });
        await apiUtils.createTask({ column_uuid: board.columns[0].uuid, name: 'Task 2' });
        await boardPage.goto();
        const task1 = boardPage.taskByTitle('Task 1');
        const task2 = boardPage.taskByTitle('Task 2');
        const mouse = boardPage.page.mouse;
        await drag(mouse, task1, task2);
        await expect(boardPage.tasksInColumn(0)).toHaveText(['Task 2', 'Task 1']);
    });

    test('Drag down in the same column', async ({ boardPageWithColumn, apiUtils }) => {
        const [boardPage, board] = boardPageWithColumn;
        await apiUtils.createTask({ column_uuid: board.columns[0].uuid, name: 'Task 1' });
        await apiUtils.createTask({ column_uuid: board.columns[0].uuid, name: 'Task 2' });
        await boardPage.goto();
        const task1 = boardPage.taskByTitle('Task 1');
        const task2 = boardPage.taskByTitle('Task 2');
        const mouse = boardPage.page.mouse;
        await drag(mouse, task2, task1);
        await expect(boardPage.tasksInColumn(0)).toHaveText(['Task 2', 'Task 1']);
    });
});

test.describe('Column drag and drop', () => {
    test('Column position can be moved up', async ({ boardPageWithData, pageObjects }) => {
        const [boardPage] = boardPageWithData;
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const editModal = new pageObjects.BoardModal(boardPage.page);
        await drag(editModal.page.mouse, editModal.nthColDragBtn(1), editModal.nthColDragBtn(0));
        await editModal.submitBtn.click();
        await expect(boardPage.nthColumnHeader(0)).toHaveText('Column 2 (1)');
        await expect(boardPage.nthColumnHeader(1)).toHaveText('Column 1 (1)');
    });

    test('Column position can be moved down', async ({ boardPageWithData, pageObjects }) => {
        const [boardPage] = boardPageWithData;
        await boardPage.boardOptionsBtn.click();
        await boardPage.editBoardBtn.click();
        const editModal = new pageObjects.BoardModal(boardPage.page);
        await drag(editModal.page.mouse, editModal.nthColDragBtn(0), editModal.nthColDragBtn(1));
        await editModal.submitBtn.click();
        await expect(boardPage.nthColumnHeader(0)).toHaveText('Column 2 (1)');
        await expect(boardPage.nthColumnHeader(1)).toHaveText('Column 1 (1)');
    });
});
