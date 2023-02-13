import { UniqueIdentifier } from '@dnd-kit/core';
import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class BoardPage extends BasePage {
    readonly page: Page;
    readonly columns: Locator;
    readonly newColumnLabel: Locator;
    readonly newColumnInput: Locator;
    readonly tasks: Locator;
    readonly colorPicker: Locator;
    readonly colorPickerSaturation: Locator;
    readonly colorPickerHue: Locator;
    readonly colorPickerInput: Locator;
    readonly colorSubmit: Locator;

    constructor(page: Page, boardUUID: string) {
        super(page);
        this.page = page;
        this.url = `/board/${boardUUID}`;
        this.columns = this.page.getByTestId('board-column');
        this.newColumnLabel = this.page.getByText('+ New Column');
        this.newColumnInput = this.page.getByLabel('+ New Column');
        this.tasks = this.page.getByTestId('task');
        this.colorPicker = this.page.getByTestId('color-picker-container');
        this.colorPickerSaturation = this.colorPicker.locator('react-colorful__saturation');
        this.colorPickerHue = this.colorPicker.locator('react-colorful__hue');
        this.colorPickerInput = this.colorPicker.getByTestId('color-input');
        this.colorSubmit = this.colorPicker.getByTestId('color-submit');
    }

    nthColumnHeader = (n: number) => {
        return this.columns.nth(n).locator('h3');
    };

    nthColumnColorIndicator = (n: number) => {
        return this.columns.nth(n).getByTestId('column-color');
    };

    tasksInColumn = (column: string | number) => {
        if (typeof column === 'string') {
            return this.columns.filter({ hasText: column }).getByTestId('task');
        } else {
            return this.columns.nth(column).getByTestId('task');
        }
    };

    taskByTitle = (title: string, fromColumn?: string) => {
        const base = fromColumn ? this.columns.filter({ hasText: fromColumn }).getByTestId('task') : this.tasks;
        return base.filter({ hasText: title });
    };
}
