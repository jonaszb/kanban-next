import { test as base, request, APIRequestContext, Page } from '@playwright/test';
import pageObjects from './tests/pageObjects/';
import ApiUtils from './utils/testApiUtils';
import type { Board } from './types';
import type BasePage from './tests/pageObjects/BasePage';
import BoardPage from './tests/pageObjects/BoardPage';

type CustomFixtures = {
    testBoard: Board;
    testBoardWithColumn: Board;
    testBoardWithData: Board;
    apiUtils: ApiUtils;
    basePage: BasePage;
    boardPage: [BoardPage, Board];
    boardPageWithColumn: [BoardPage, Board];
    pageObjects: typeof pageObjects;
    noAuthRequest: APIRequestContext;
    noAuthPage: Page;
    altRequest: APIRequestContext;
};

export const test = base.extend<CustomFixtures>({
    apiUtils: async ({ request }, use) => {
        const apiUtils = new ApiUtils(request);
        await use(apiUtils);
    },
    /** Create a Board to be used in the test */
    testBoard: async ({ apiUtils }, use) => {
        const board = await apiUtils.createBoard({ name: 'Board-' + Math.floor(Math.random() * 1000000) });
        await use(board);
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },

    testBoardWithColumn: async ({ apiUtils }, use) => {
        const response = await apiUtils.createBoard({
            name: 'Board-' + Math.floor(Math.random() * 1000000),
            columns: [{ name: 'Column 1', color: '#FFFAAA', position: 0 }],
        });
        const board = await apiUtils.getBoard(response.uuid);
        await use(board);
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },

    boardPageWithColumn: async ({ testBoardWithColumn, page, pageObjects }, use) => {
        const boardPage = new pageObjects.BoardPage(page, testBoardWithColumn.uuid);
        await boardPage.goto();
        await use([boardPage, testBoardWithColumn]);
    },

    /** Create a test board with 2 columns and 2 tasks (1 per column) */
    testBoardWithData: async ({ apiUtils }, use) => {
        const response = await apiUtils.createBoard({
            name: 'Board-' + Math.floor(Math.random() * 1000000),
            columns: [
                { name: 'Column 1', color: '#FFFAAA', position: 0 },
                { name: 'Column 2', color: '#AAAFFF', position: 1 },
            ],
        });
        const board = await apiUtils.getBoard(response.uuid);
        const task1 = await apiUtils.createTask({
            name: 'Task 1',
            description: 'Task 1 description',
            column_uuid: board.columns[0].uuid,
        });
        const task2 = await apiUtils.createTask({
            name: 'Task 2',
            description: 'Task 2 description',
            column_uuid: board.columns[1].uuid,
        });
        board.columns[0].tasks = [task1];
        board.columns[1].tasks = [task2];
        await use(board);
        await apiUtils.deleteBoard(board.uuid, { failOnStatusCode: false });
    },

    basePage: async ({ page }, use) => {
        const basePage = new pageObjects.BasePage(page);
        await basePage.goto();
        await use(basePage);
    },

    boardPage: async ({ testBoard, page }, use) => {
        const boardPage = new pageObjects.BoardPage(page, testBoard.uuid);
        await boardPage.goto();
        await use([boardPage, testBoard]);
    },

    pageObjects: async ({}, use) => {
        await use(pageObjects);
    },

    noAuthRequest: async ({}, use) => {
        const context = await request.newContext({
            baseURL: process.env.BASE_URL,
            storageState: { cookies: [], origins: [] },
        });
        await use(context);
        await context.dispose();
    },

    noAuthPage: async ({ browser }, use) => {
        const page = await browser.newPage({
            baseURL: process.env.BASE_URL,
            storageState: undefined,
        });
        await use(page);
        await page.close();
    },

    altRequest: async ({}, use) => {
        const context = await request.newContext({
            baseURL: process.env.BASE_URL,
            storageState: 'storageStateAlt.json',
        });
        await use(context);
        await context.dispose();
    },
});
export { expect } from '@playwright/test';
