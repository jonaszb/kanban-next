import { test, expect } from '@playwright/experimental-ct-react';
import Header from './Header';

test.describe('Header', () => {
    test('Renders the "New Task" button', async ({ mount }) => {
        const component = await mount(<Header />);
        const button = component.locator('#new-task');
        await expect(button).toBeVisible();
        await expect(button).toHaveText('+ Add New Task', { useInnerText: true });
    });

    test.describe('on mobile', () => {
        test.use({ viewport: { width: 500, height: 500 } });

        test('The "New Task" button has no text', async ({ mount }) => {
            const component = await mount(<Header />);
            const button = component.locator('#new-task');
            await expect(button).toHaveText('', { useInnerText: true });
        });
    });
});
