import { test, expect } from '@playwright/experimental-ct-react';
import ThemeToggle from './ThemeToggle';

test.describe('ThemeToggle', () => {
    test.use({ viewport: { width: 256, height: 256 } });
    test('Theme toggle is rendered (dark mode enabled)', async ({ mount }) => {
        const component = await mount(
            <div className="dark">
                <ThemeToggle darkModeEnabled changeThemeHandler={() => {}} />
            </div>
        );
        expect(await component.screenshot()).toMatchSnapshot('theme-toggle-dark.png');
    });

    test('Theme toggle is rendered (dark mode disabled)', async ({ mount }) => {
        const component = await mount(<ThemeToggle darkModeEnabled={false} changeThemeHandler={() => {}} />);
        expect(await component.screenshot()).toMatchSnapshot('theme-toggle-light.png');
    });
});
