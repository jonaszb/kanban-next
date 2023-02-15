import type { Locator, Page } from '@playwright/test';
import BaseModal from './BaseModal';

export default class TaskDetails extends BaseModal {
    readonly name: Locator;
    readonly subtaskRows: Locator;
    readonly optionsBtn: Locator;
    readonly editBtn: Locator;
    readonly deleteBtn: Locator;
    readonly description: Locator;
    readonly statusDropdown: Locator;
    readonly subtasksHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.rootElement = this.page.getByTestId('task-details');
        this.name = this.rootElement.getByTestId('task-name');
        this.optionsBtn = this.rootElement.getByTestId('task-options');
        this.editBtn = this.page.locator('#task-edit');
        this.deleteBtn = this.page.locator('#task-delete');
        this.description = this.rootElement.getByTestId('task-description');
        this.subtasksHeader = this.rootElement.getByTestId('subtasks-header');
        this.subtaskRows = this.rootElement.getByTestId('subtask');
        this.statusDropdown = this.rootElement.locator('#column-select');
    }

    nthSubtaskCheckbox(n: number) {
        return this.subtaskRows.nth(n).locator('input');
    }

    nthSubtaskText(n: number) {
        return this.subtaskRows.nth(n).locator('span');
    }

    async editTask() {
        await this.optionsBtn.click();
        await this.editBtn.click();
    }

    async clickNthSubtask(n: number) {
        const revalidatePromise = this.page.waitForResponse('**/api/subtasks/**');
        await this.subtaskRows.nth(n).click();
        await revalidatePromise;
    }
}
