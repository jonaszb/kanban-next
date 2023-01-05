import { test, expect } from '@playwright/experimental-ct-react';
import BoardList from './BoardList';

test.use({ viewport: { width: 500, height: 500 } });

const testBoards = [
    {
        uuid: '3f67db32-19f4-4e9e-8520-72baf40fd85d',
        name: 'Platform Launch',
    },
    {
        uuid: '8a263f90-0d21-4960-81aa-0c9a0e4a5522',
        name: 'Product Roadmap',
    },
    {
        uuid: 'fe7f8854-22c7-4b91-b9d0-50af60d4ddeb',
        name: 'Marketing Campaign',
    },
];

const hooksConfig = {
    hooksConfig: {
        router: {
            query: { boardId: '8a263f90-0d21-4960-81aa-0c9a0e4a5522' },
            asPath: '/boards',
        },
    },
};

test.describe('BoardList', () => {
    test('renders a link for each board', async ({ mount }) => {
        const component = await mount(<BoardList boards={testBoards} />, hooksConfig);
        const links = component.locator('a');
        await expect(links).toHaveCount(3);
        await expect(links).toHaveText(['Platform Launch', 'Product Roadmap', 'Marketing Campaign']);
    });

    test('renders the active board with a different style', async ({ mount }) => {
        const component = await mount(<BoardList boards={testBoards} />, hooksConfig);
        const links = component.locator('a');
        await expect(links.nth(0)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)'); // Default
        await expect(links.nth(0)).toHaveCSS('color', 'rgb(130, 143, 163)');
        await expect(links.nth(1)).toHaveCSS('background-color', 'rgb(99, 95, 199)'); // Active
        await expect(links.nth(1)).toHaveCSS('color', 'rgb(255, 255, 255)');
    });

    test('inactive boards have a hover state', async ({ mount }) => {
        const component = await mount(<BoardList boards={testBoards} />, hooksConfig);
        const inactiveLink = component.locator('a').nth(0);
        await expect(inactiveLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)'); // Default
        await expect(inactiveLink).toHaveCSS('color', 'rgb(130, 143, 163)');
        await inactiveLink.hover();
        await expect(inactiveLink).toHaveCSS('background-color', 'rgba(151, 151, 151, 0.1)'); // Hover
        await expect(inactiveLink).toHaveCSS('color', 'rgb(99, 95, 199)');
    });

    test('active board does not have a hover state', async ({ mount }) => {
        const component = await mount(<BoardList boards={testBoards} />, hooksConfig);
        const activeLink = component.locator('a').nth(1);
        await expect(activeLink).toHaveCSS('background-color', 'rgb(99, 95, 199)');
        await expect(activeLink).toHaveCSS('color', 'rgb(255, 255, 255)');
        await activeLink.hover();
        await expect(activeLink).toHaveCSS('background-color', 'rgb(99, 95, 199)');
        await expect(activeLink).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
});
