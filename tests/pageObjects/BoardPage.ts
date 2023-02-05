import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class BoardPage extends BasePage {
    readonly page: Page;
    readonly columns: Locator;
    readonly newColumnLabel: Locator;
    readonly newColumnInput: Locator;

    constructor(page: Page, boardUUID: string) {
        super(page);
        this.page = page;
        this.url = `/board/${boardUUID}`;
        this.columns = this.page.getByTestId('board-column');
        this.newColumnLabel = this.page.getByText('+ New Column');
        this.newColumnInput = this.page.getByLabel('+ New Column');
    }

    nthColumnHeader = (n: number) => {
        return this.columns.nth(n).locator('h3');
    };
}
