import type { Page } from '@playwright/test';

export type RequestOptionsWithBody = Parameters<Page['request']['post']>[1];
export type RequestOptionsNoBody = Parameters<Page['request']['get']>[1];

export type Board = {
    name: string;
    uuid: string;
};
