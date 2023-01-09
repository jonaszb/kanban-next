import { test, expect } from '@playwright/experimental-ct-react';
import Board from './Board';
import type { Columns } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const testColumns: Columns = {
    todo: {
        color: '#49C4E5',
        tasks: [
            {
                title: 'Placeholder 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
        ],
    },
    doing: {
        color: '#8471F2',
        tasks: [
            {
                title: 'Placeholder 2',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Placeholder 3',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
        ],
    },
    finished: {
        color: '#67E2AE',
        tasks: [],
    },
};

const hexToRGB = (h: string) => {
    const r = '0x' + h[1] + h[2];
    const g = '0x' + h[3] + h[4];
    const b = '0x' + h[5] + h[6];
    return `rgb(${+r}, ${+g}, ${+b})`;
};
test.describe('Board', () => {
    test('All columns are displayed', async ({ mount }) => {
        const component = await mount(<Board boardUUID={uuidv4()} columns={testColumns} />);
        const columns = component.getByTestId('board-column');
        await expect(columns).toHaveCount(3);
    });

    test('Columns have correct names', async ({ mount }) => {
        const component = await mount(<Board boardUUID={uuidv4()} columns={testColumns} />);
        const columns = component.getByTestId('board-column');
        const columnHeaders = columns.locator('h3');
        // Check that each header contains the column name and number of tasks
        const columnNames: string[] = [];
        Object.entries(testColumns).forEach(([key, value]) => columnNames.push(`${key} (${value.tasks.length})`));
        await expect(columnHeaders).toHaveText(columnNames);
    });

    test('Columns have correct color indicators', async ({ mount }) => {
        const component = await mount(<Board boardUUID={uuidv4()} columns={testColumns} />);
        const columns = component.getByTestId('board-column');
        // For each item in the columns object, check that the color indicator has the correct color
        for (const [key, value] of Object.entries(testColumns)) {
            const indicator = columns.filter({ hasText: key }).getByTestId('column-color');
            await expect(indicator).toHaveCSS('background-color', hexToRGB(value.color));
        }
    });

    // test.describe('Drag and drop', () => {
    //     test('Task can be dropped into an empty column', async ({ mount }) => {
    //         const component = await mount(<Board boardUUID={uuidv4()} columns={testColumns} />);
    //         const taskToDrag = component.locator('li', { hasText: 'Placeholder 3' });
    //         const taskBox = await taskToDrag.boundingBox();
    //         if (!taskBox) throw new Error(`Task box is ${taskBox}`);
    //         const todoColumn = component.getByTestId('board-column').first();
    //         const todoBox = await todoColumn.boundingBox();
    //         console.log('todoBox: ', todoBox);

    //         await taskToDrag.dragTo(todoColumn, {
    //             force: true,
    //             sourcePosition: {
    //                 x: taskBox.width / 2,
    //                 y: taskBox.height / 2,
    //             },
    //             targetPosition: {
    //                 x: todoBox?.width ? todoBox.width / 2 : 0,
    //                 y: todoBox?.height ? todoBox.height / 2 : 0,
    //             },
    //         });
    //         // Check if the task is now in todo column
    //         await expect(todoColumn.locator('li', { hasText: 'Placeholder 3' })).toBeVisible();
    //     });
    // });
});
