Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
    })),
});

import { render } from '../../../utils/test-utils';
import Header from './Header';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import { ReactElement } from 'react';
import BoardListContextProvider from '../../../store/BoardListContext';
import type { BoardListContextProps } from '../../../store/BoardListContext';
import React from 'react';
import { Board } from '../../../types';

const sharedProps = {
    created_at: new Date(),
    updated_at: new Date(),
    user_uuid: uuidv4(),
    columns: [],
};
const boards: Board[] = [
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

jest.spyOn(React, 'useEffect').mockImplementation((f) => {});

jest.mock('next/router', () => ({
    useRouter() {
        return {
            query: { boardId: boards[1].uuid }, // Marketing Plan is selected
            asPath: '/boards',
        };
    },
}));

const renderWithCtx = (ui: ReactElement, providerProps: BoardListContextProps) => {
    return render(<BoardListContextProvider value={providerProps}>{ui}</BoardListContextProvider>);
};

const providerProps = {
    boards: boards,
    selectedBoard: boards[1].uuid,
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

describe('Header', () => {
    test('Board name is displayed if provided', async () => {
        const result = renderWithCtx(<Header />, providerProps);
        const header = result.container.querySelector('#board-header');
        expect(header).toBeVisible();
        expect(header).toHaveTextContent('Marketing Plan');
    });

    test('Board name is not displayed if not provided', async () => {
        const result = renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const header = result.container.querySelector('#board-header');
        expect(header).toBeEmptyDOMElement();
    });

    test('New Task button is displayed', async () => {
        const result = renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#new-task');
        expect(button).toBeVisible();
        expect(button).toHaveTextContent('+ Add New Task');
    });

    test('New Task button is disabled if no board is selected', async () => {
        const result = renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#new-task');
        expect(button).toBeDisabled();
    });

    test('New Task button is disabled if a board is selected but has no columns', async () => {
        const result = renderWithCtx(<Header />, providerProps);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeDisabled();
    });

    test('New Task button is enabled if a board is selected and has at least one column', async () => {
        const propsWithColumn = { ...providerProps };
        propsWithColumn.boards[1].columns = [
            {
                id: 1,
                uuid: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Col',
                position: 1,
                color: '#000000',
                board_uuid: uuidv4(),
                user_uuid: uuidv4(),
            },
        ];
        const result = renderWithCtx(<Header />, propsWithColumn);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeEnabled();
    });

    test('Board Options button is displayed', async () => {
        const result = renderWithCtx(<Header />, providerProps);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeVisible();
    });

    test('Board Options button is enabled if a board is selected', async () => {
        const result = renderWithCtx(<Header />, providerProps);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeEnabled();
    });

    // Popover is used for logout as well
    test('Board Options button is enabled if no board is selected', async () => {
        const result = renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#board-options');
        expect(button).toBeEnabled();
    });
});
