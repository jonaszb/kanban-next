import type { Locator, Page } from '@playwright/test';
import BaseModal from './BaseModal';

export default class TaskForm extends BaseModal {
    readonly title: Locator;
    readonly description: Locator;
    readonly subtaskRows: Locator;
    readonly addSubtaskBtn: Locator;
    readonly submitBtn: Locator;
    readonly statusDropdown: Locator;

    constructor(page: Page) {
        super(page);
        this.rootElement = this.page.getByTestId('task-form');
        this.title = this.rootElement.locator('#task-title');
        this.description = this.rootElement.locator('#task-description');
        this.subtaskRows = this.rootElement.locator('#subtasks > div');
        this.addSubtaskBtn = this.rootElement.locator('#subtasks-add');
        this.submitBtn = this.rootElement.getByTestId('task-submit');
        this.statusDropdown = this.rootElement.locator('#column-select');
    }

    nthSubtaskInput(n: number) {
        return this.subtaskRows.nth(n).locator('textarea');
    }

    nthSubtaskDeleteBtn(n: number) {
        return this.subtaskRows.nth(n).getByTestId('multi-input-delete');
    }

    nthSubtaskDragBtn(n: number) {
        return this.subtaskRows.nth(n).getByTestId('multi-input-drag');
    }

    /**
     * @param fieldLabel Text of the label to locate the field by
     * @param n Nth elemenent to check for error. Use when checking MultiValueInput
     */
    fieldError(fieldLabel: string, n?: number) {
        const elem = this.rootElement.locator('fieldset', { hasText: fieldLabel }).locator('.text-danger');
        return n ? elem.nth(n) : elem;
    }
}
