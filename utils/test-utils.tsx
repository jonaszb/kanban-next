import { render, RenderOptions } from '@testing-library/react';
import React, { FC, ReactElement } from 'react';
import fs from 'fs';
import { Board } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample data for boards and board list context
const sharedProps = {
    created_at: new Date(),
    updated_at: new Date(),
    user_uuid: uuidv4(),
    columns: [],
};
export const testBoards: Board[] = [
    {
        name: 'Platform Launch',
        uuid: uuidv4(),
        id: 1,
        ...sharedProps,
    },
    {
        name: 'Marketing Plan',
        uuid: uuidv4(),
        id: 2,
        ...sharedProps,
    },
    {
        name: 'Roadmap',
        uuid: uuidv4(),
        id: 3,
        ...sharedProps,
    },
];

export const boardsCtxValue = {
    boards: testBoards,
    selectedBoard: testBoards[1].uuid,
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

const wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    const view = render(ui, { wrapper, ...options });

    const style = document.createElement('style');
    style.innerHTML = fs.readFileSync('utils/testStyles.css', 'utf8');
    document.head.appendChild(style);

    return view;
};

export * from '@testing-library/react';
export { customRender as render };
