import { test, expect } from '../../fixtures';

test.describe('Edit column color', () => {
    test('Color picker can be toggled', async ({ boardPageWithColumn: [boardPage] }) => {
        await boardPage.nthColumnColorIndicator(0).click();
        await expect(boardPage.colorPicker).toBeVisible();
        await boardPage.nthColumnColorIndicator(0).click();
        await expect(boardPage.colorPicker).not.toBeVisible();
    });

    test('Current column color is selected by default', async ({ boardPageWithColumn: [boardPage, boardData] }) => {
        await boardPage.nthColumnColorIndicator(0).click();
        await expect(boardPage.colorPickerInput).toHaveValue(boardData.columns[0].color.slice(1));
        await boardPage.nthColumnColorIndicator(0).click();
    });

    test('Color indicator is updated to match the current value', async ({ boardPageWithColumn: [boardPage] }) => {
        await boardPage.nthColumnColorIndicator(0).click();
        await boardPage.colorPickerInput.fill('ff0000');
        await expect(boardPage.nthColumnColorIndicator(0)).toHaveCSS('background-color', 'rgb(255, 0, 0)');
        await boardPage.nthColumnColorIndicator(0).click();
    });

    test('Closing the picker without saving does not change the color', async ({
        boardPageWithColumn: [boardPage],
    }) => {
        await boardPage.nthColumnColorIndicator(0).click();
        await boardPage.colorPickerInput.fill('ff0000');
        await boardPage.nthColumnColorIndicator(0).click();
        await expect(boardPage.nthColumnColorIndicator(0)).toHaveCSS('background-color', 'rgb(255, 250, 170)');
    });

    test('Invalid values are not accepted', async ({ boardPageWithColumn: [boardPage] }) => {
        await boardPage.nthColumnColorIndicator(0).click();
        await boardPage.colorPickerInput.fill('GGGGGG');
        await expect(boardPage.colorPickerInput).toHaveValue('');
        await boardPage.colorPickerInput.fill('-123123');
        await expect(boardPage.colorPickerInput).toHaveValue('123123');
        await boardPage.colorPickerInput.fill('123123123');
        await expect(boardPage.colorPickerInput).toHaveValue('123123');
        await boardPage.colorPickerInput.fill('{}:;"<>/.,!@£$%^&*() ');
        await expect(boardPage.colorPickerInput).toHaveValue('');
    });

    test('Color can be changed', async ({ boardPageWithColumn: [boardPage] }) => {
        await boardPage.nthColumnColorIndicator(0).click();
        await boardPage.colorPickerInput.fill('ff0000');
        await boardPage.colorSubmit.click();
        await expect(boardPage.colorPicker).toBeHidden();
        await expect(boardPage.nthColumnColorIndicator(0)).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    });
});
