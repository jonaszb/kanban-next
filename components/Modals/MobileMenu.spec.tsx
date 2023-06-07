Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
    })),
});

import { fireEvent, render, screen, act, testBoards as boards } from '../../utils/test-utils';
import MobileMenu from './MobileMenu';
import '@testing-library/jest-dom';
import React, { ReactElement } from 'react';
import BoardListContextProvider, { BoardListContextProps } from '../../store/BoardListContext';

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
        const link = screen.getAllByRole('link')[0];
        link.addEventListener('click', (event) => event.preventDefault(), false);
        fireEvent.click(link);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('Clicking the currently selected board closes the modal', async () => {
        const mockFn = jest.fn();
        await renderWithCtx(<MobileMenu setMenuIsOpen={mockFn} />, providerProps);
        const link = screen.getAllByRole('link')[1];
        link.addEventListener('click', (event) => event.preventDefault(), false);
        fireEvent.click(link);
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
