import { test as base } from '@playwright/test';
import ApiUtils from './utils/testApiUtils';
import type { Board } from './types';

type CustomFixtures = {
    testBoard: Board;
    apiUtils: ApiUtils;
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
        await apiUtils.deleteBoard(board.uuid);
    },
});
export { expect } from '@playwright/test';
