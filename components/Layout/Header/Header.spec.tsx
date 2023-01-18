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

const boards = [
    {
        name: 'Platform Launch',
        uuid: uuidv4(),
    },
    {
        name: 'Marketing Plan',
        uuid: uuidv4(),
    },
    {
        name: 'Roadmap',
        uuid: uuidv4(),
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

    test('New Task button is enabled if a board is selected', async () => {
        const result = renderWithCtx(<Header />, providerProps);
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

    test('Board Options button is disabled if no board is selected', async () => {
        const result = renderWithCtx(<Header />, { ...providerProps, selectedBoard: null });
        const button = result.container.querySelector('#board-options');
        expect(button).toBeDisabled();
    });
});
