import type { Locator, Page } from '@playwright/test';

export default class BaseModal {
    readonly page: Page;
    rootElement: Locator;
    readonly header: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rootElement = this.page.getByTestId('modal');
        this.header = this.rootElement.getByRole('heading');
    }
}
