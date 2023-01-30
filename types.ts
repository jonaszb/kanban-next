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
    {
        color: string;
        tasks: Task[];
    }
>;

export type Task = { name: UniqueIdentifier; subtasks: Subtask[]; position: number; description: string; uuid: string };

export type Subtask = {
    name: string;
    uuid: string;
    completed: boolean;
};

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

export type MultiInputChangeEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLSelectElement>;
export type MultiInputFocusEvent =
    | React.FocusEvent<HTMLInputElement>
    | React.FocusEvent<HTMLTextAreaElement>
    | React.FocusEvent<HTMLSelectElement>;
