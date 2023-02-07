Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
    })),
});

import { fireEvent, render, screen, act } from '../../utils/test-utils';
import MobileMenu from './MobileMenu';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import React, { ReactElement } from 'react';
import BoardListContextProvider, { BoardListContextProps } from '../../store/BoardListContext';
import { Board } from '../../types';

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

jest.mock('next/router', () => ({
    useRouter() {
        return {
            query: { boardId: boards[1].uuid }, // Marketing Plan is selected
        };
    },
}));

const menuProps = {
    setMenuIsOpen: jest.fn(),
};

jest.spyOn(React, 'useEffect').mockImplementation((f) => {});

const renderWithCtx = async (ui: ReactElement, providerProps: BoardListContextProps) => {
    return await act(async () =>
        render(<BoardListContextProvider value={providerProps}>{ui}</BoardListContextProvider>)
    );
};

const providerProps = {
    boards: boards,
    selectedBoard: boards[1],
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

describe('Mobile menu', () => {
    test('Renders each board', async () => {
        await renderWithCtx(<MobileMenu {...menuProps} />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links.length).toEqual(3);
    });

    test('Can be rendered with no boards', async () => {
        await renderWithCtx(<MobileMenu {...menuProps} />, { ...providerProps, boards: [] });
        const links = screen.queryAllByRole('link');
        expect(links.length).toEqual(0);
    });

    test('Renders each board name', async () => {
        await renderWithCtx(<MobileMenu {...menuProps} />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveTextContent('Platform Launch');
        expect(links[1]).toHaveTextContent('Marketing Plan');
        expect(links[2]).toHaveTextContent('Roadmap');
    });

    test('Renders each board link', async () => {
        await renderWithCtx(<MobileMenu {...menuProps} />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', `/board/${boards[0].uuid}`);
        expect(links[1]).toHaveAttribute('href', `/board/${boards[1].uuid}`);
        expect(links[2]).toHaveAttribute('href', `/board/${boards[2].uuid}`);
    });

    test('Link to current board is active', async () => {
        await renderWithCtx(<MobileMenu {...menuProps} />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links[0]).not.toHaveClass('bg-primary');
        expect(links[1]).toHaveClass('bg-primary');
        expect(links[2]).not.toHaveClass('bg-primary');
    });

    test('Header contains the number of boards', async () => {
        const result = await renderWithCtx(<MobileMenu {...menuProps} />, providerProps);
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (3)');
    });

    test('Header contains the number of boards when there are no boards', async () => {
        const result = await renderWithCtx(<MobileMenu {...menuProps} />, { ...providerProps, boards: [] });
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (0)');
    });

    test('Selecting a board closes the modal', async () => {
        const mockFn = jest.fn();
        await renderWithCtx(<MobileMenu setMenuIsOpen={mockFn} />, providerProps);
        const links = screen.getAllByRole('link');
        fireEvent.click(links[0]);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('Clicking the currently selected board closes the modal', async () => {
        const mockFn = jest.fn();
        await renderWithCtx(<MobileMenu setMenuIsOpen={mockFn} />, providerProps);
        const links = screen.getAllByRole('link');
        fireEvent.click(links[1]);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('Modal stays open if other menu elements are clicked (not links or backdrop)', async () => {
        const mockFn = jest.fn();
        await renderWithCtx(<MobileMenu setMenuIsOpen={mockFn} />, providerProps);
        const heading = screen.getByTestId('board-count');
        const themeToggle = screen.getByRole('switch');
        fireEvent.click(heading);
        fireEvent.click(themeToggle);
        expect(mockFn).toHaveBeenCalledTimes(0);
    });
});
