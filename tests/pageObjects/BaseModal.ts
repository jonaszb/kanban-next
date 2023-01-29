import type { Locator, Page } from '@playwright/test';

export default class BaseModal {
    readonly page: Page;
    readonly rootElement: Locator;
    readonly header: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rootElement = this.page.locator('dialog').last();
        this.header = this.rootElement.getByRole('heading');
    }
}
