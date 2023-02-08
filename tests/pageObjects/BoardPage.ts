import { UniqueIdentifier } from '@dnd-kit/core';
import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class BoardPage extends BasePage {
    readonly page: Page;
    readonly columns: Locator;
    readonly newColumnLabel: Locator;
    readonly newColumnInput: Locator;
    readonly tasks: Locator;

    constructor(page: Page, boardUUID: string) {
        super(page);
        this.page = page;
        this.url = `/board/${boardUUID}`;
        this.columns = this.page.getByTestId('board-column');
        this.newColumnLabel = this.page.getByText('+ New Column');
        this.newColumnInput = this.page.getByLabel('+ New Column');
        this.tasks = this.page.getByTestId('task');
    }

    nthColumnHeader = (n: number) => {
        return this.columns.nth(n).locator('h3');
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
