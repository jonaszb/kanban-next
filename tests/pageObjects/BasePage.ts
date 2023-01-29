import { Locator, Page } from '@playwright/test';

export default class BasePage {
    readonly page: Page;
    url: string;
    readonly sidebar: Locator;
    readonly boardListHeader: Locator;
    readonly boardList: Locator;
    readonly appRootElement: Locator;
    readonly boards: Locator;
    readonly themeToggle: Locator;
    readonly boardHeader: Locator;
    readonly newTaskBtn: Locator;
    readonly boardOptionsBtn: Locator;
    readonly hideSidebarBtn: Locator;
    readonly showSidebarBtn: Locator;
    readonly newBoardBtn: Locator;
    readonly mobileMenuToggle: Locator;
    readonly deleteBoardBtn: Locator;
    readonly editBoardBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.url = '/';
        this.appRootElement = this.page.locator('.app-container');
        // Sidebar
        this.sidebar = this.page.locator('#sidebar');
        this.boardList = this.page.locator('#board-list').last();
        this.boardListHeader = this.boardList.locator('#board-count');
        this.boards = this.boardList.locator('a');
        this.newBoardBtn = this.boardList.locator('#new-board-btn');
        this.themeToggle = this.page.locator('#theme-toggle label').last();
        this.hideSidebarBtn = this.page.locator('#hide-sidebar-btn');
        this.showSidebarBtn = this.page.locator('#show-sidebar-btn');
        // Header
        this.boardHeader = this.page.locator('#board-header');
        this.mobileMenuToggle = this.page.locator('#mobile-menu-toggle');
        this.newTaskBtn = this.page.locator('#new-task');
        this.boardOptionsBtn = this.page.locator('#board-options');
        this.deleteBoardBtn = this.page.locator('#board-delete');
        this.editBoardBtn = this.page.locator('#board-edit');
    }

    async goto() {
        await this.page.goto(this.url);
    }
}
