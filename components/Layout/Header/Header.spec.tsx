Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
    })),
});

import { render, testBoards as boards } from '../../../utils/test-utils';
import Header from './Header';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import { ReactElement } from 'react';
import BoardListContextProvider from '../../../store/BoardListContext';
import type { BoardListContextProps } from '../../../store/BoardListContext';
import React from 'react';
import { act } from 'react-dom/test-utils';

jest.spyOn(React, 'useEffect').mockImplementation((f) => {});

jest.mock('next/router', () => ({
    useRouter() {
        return {
            query: { boardId: boards[1].uuid }, // Marketing Plan is selected
            asPath: '/boards',
        };
    },
}));

jest.mock('next-auth/react', () => {
    const mockSession = {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { username: 'test' },
    };
    return {
        useSession: jest.fn(() => {
            return { data: mockSession, status: 'authenticated' };
        }),
    };
});

const renderWithCtx = async (ui: ReactElement, providerProps: BoardListContextProps) => {
    return await act(async () =>
        render(<BoardListContextProvider value={providerProps}>{ui}</BoardListContextProvider>)
    );
};

const providerProps = {
    boards: boards,
    selectedBoard: boards[1],
    selectedTask: null,
    setSelectedTask: () => null,
    isLoading: false,
    isValidating: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

describe('Header', () => {
    test('Board name is displayed if provided', async () => {
        const result = await renderWithCtx(<Header />, providerProps);
        const header = result.container.querySelector('#board-header');
        expect(header).toBeVisible();
        expect(header).toHaveTextContent('Marketing Plan');
    });

    test('Board name is not displayed if not provided', async () => {
        const result = await renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const header = result.container.querySelector('#board-header');
        expect(header).toBeEmptyDOMElement();
    });

    test('New Task button is displayed', async () => {
        const result = await renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#new-task');
        expect(button).toBeVisible();
        expect(button).toHaveTextContent('+ Add New Task');
    });

    test('New Task button is disabled if no board is selected', async () => {
        const result = await renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#new-task');
        expect(button).toBeDisabled();
    });

    test('New Task button is disabled if a board is selected but has no columns', async () => {
        const result = await renderWithCtx(<Header />, providerProps);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeDisabled();
    });

    test('New Task button is enabled if a board is selected and has at least one column', async () => {
        const propsWithColumn = { ...providerProps };
        propsWithColumn.boards[1].columns = [
            {
                id: 1,
                uuid: uuidv4(),
                created_at: new Date(),
                updated_at: new Date(),
                name: 'Col',
                tasks: [],
                position: 1,
                color: '#000000',
                board_uuid: uuidv4(),
                user_uuid: uuidv4(),
            },
        ];
        const result = await renderWithCtx(<Header />, propsWithColumn);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeEnabled();
    });

    test('Board Options button is displayed', async () => {
        const result = await renderWithCtx(<Header />, providerProps);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeVisible();
    });

    test('Board Options button is enabled if a board is selected', async () => {
        const result = await renderWithCtx(<Header />, providerProps);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeEnabled();
    });

    // Popover is used for logout as well
    test('Board Options button is enabled if no board is selected', async () => {
        const result = await renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#board-options');
        expect(button).toBeEnabled();
    });
});
