import type { Page } from '@playwright/test';
import { UniqueIdentifier } from '@dnd-kit/core';

// Types for Playwright request wrappers
export type RequestOptionsWithBody = Parameters<Page['request']['post']>[1];
export type RequestOptionsNoBody = Parameters<Page['request']['get']>[1];

export type Board = {
    id: number;
    uuid: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    user_uuid: string;
    columns: Column[];
};

export type MultiInput = {
    value: string;
    id: string;
    isValid?: boolean;
    isTouched?: boolean;
    errorMsg?: string;
};

export type Columns = Record<
    UniqueIdentifier,
    { color: string; tasks: { title: UniqueIdentifier; subtasksDone: number; subtasksTotal: number }[] }
>;

export type Column = {
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    position: number;
    color: string;
    board_uuid: string;
    user_uuid: string;
    tasks?: any[]; // TODO: add type
};

export type MultiInputChangeEvent = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>;
export type MultiInputFocusEvent = React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>;
