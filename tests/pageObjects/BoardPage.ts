import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class BoardPage extends BasePage {
    readonly page: Page;

    constructor(page: Page, boardUUID: string) {
        super(page);
        this.page = page;
        this.url = `/board/${boardUUID}`;
    }
}
