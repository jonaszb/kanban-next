import type { Page } from '@playwright/test';
import { UniqueIdentifier } from '@dnd-kit/core';

export type RequestOptionsWithBody = Parameters<Page['request']['post']>[1];
export type RequestOptionsNoBody = Parameters<Page['request']['get']>[1];

export type Board = {
    name: string;
    uuid: string;
};

export type Columns = Record<
    UniqueIdentifier,
    { color: string; tasks: { title: UniqueIdentifier; subtasksDone: number; subtasksTotal: number }[] }
>;
