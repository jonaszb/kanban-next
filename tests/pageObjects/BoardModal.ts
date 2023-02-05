import type { Locator, Page } from '@playwright/test';
import BaseModal from './BaseModal';

export default class NewBoardModal extends BaseModal {
    readonly boardName: Locator;
    readonly columnRows: Locator;
    readonly addColumnBtn: Locator;
    readonly submitBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.boardName = this.rootElement.locator('#board-name');
        this.columnRows = this.rootElement.locator('#board-columns > div');
        this.addColumnBtn = this.rootElement.locator('#board-columns-add');
        this.submitBtn = this.rootElement.getByTestId('board-submit');
    }

    nthColInput(n: number) {
        return this.columnRows.nth(n).locator('input');
    }

    nthColDeleteBtn(n: number) {
        return this.columnRows.nth(n).getByTestId('multi-input-delete');
    }

    nthColDragBtn(n: number) {
        return this.columnRows.nth(n).getByTestId('multi-input-drag');
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
