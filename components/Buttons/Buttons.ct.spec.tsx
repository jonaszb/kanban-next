import { test, expect } from '@playwright/experimental-ct-react';
import { ButtonPrimaryLarge } from './Buttons';

test.use({ viewport: { width: 500, height: 500 } });

test.describe('PrimaryButtonLarge', () => {
    test('works with children', async ({ mount }) => {
        const component = await mount(<ButtonPrimaryLarge>Test button!</ButtonPrimaryLarge>);
        await expect(component).toContainText('Test button!');
    });

    test('has a hover state', async ({ mount }) => {
        const component = await mount(<ButtonPrimaryLarge>Test button!</ButtonPrimaryLarge>);
        await expect(component).toHaveCSS('background-color', 'rgb(99, 95, 199)');
        await component.hover();
        await expect(component).toHaveCSS('background-color', 'rgb(168, 164, 255)');
    });

    test('has a disabled state', async ({ mount }) => {
        const component = await mount(<ButtonPrimaryLarge disabled>Test button!</ButtonPrimaryLarge>);
        await expect(component).toHaveCSS('background-color', 'rgb(99, 95, 199)');
        await expect(component).toHaveCSS('opacity', '0.25');
        await component.hover();
        await expect(component).toHaveCSS('background-color', 'rgb(99, 95, 199)');
    });

    test('Runs onClick', async ({ mount }) => {
        let clicked = false;
        const component = await mount(
            <ButtonPrimaryLarge onClick={() => (clicked = true)}>Test button!</ButtonPrimaryLarge>
        );
        await component.click();
        expect(clicked).toBe(true);
    });
});
