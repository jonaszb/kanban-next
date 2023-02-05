import type { Locator, Page } from '@playwright/test';
import BaseModal from './BaseModal';

export default class DeleteModal extends BaseModal {
    readonly header: Locator;
    readonly message: Locator;
    readonly cancelBtn: Locator;
    readonly deleteBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.rootElement = this.page.getByTestId('danger-modal');
        this.header = this.rootElement.locator('h2');
        this.message = this.rootElement.locator('p');
        this.cancelBtn = this.rootElement.getByText('Cancel', { exact: true });
        this.deleteBtn = this.rootElement.getByText('Delete', { exact: true });
    }
}
