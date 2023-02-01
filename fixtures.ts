import { Page, test as base } from '@playwright/test';
import pageObjects from './tests/pageObjects/';
import ApiUtils from './utils/testApiUtils';
import type { Board } from './types';
import type BasePage from './tests/pageObjects/BasePage';
import BoardPage from './tests/pageObjects/BoardPage';

type CustomFixtures = {
    testBoard: Board;
    apiUtils: ApiUtils;
    basePage: BasePage;
    boardPage: [BoardPage, Board];
    pageObjects: typeof pageObjects;
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
});
export { expect } from '@playwright/test';
