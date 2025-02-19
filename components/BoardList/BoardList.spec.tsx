import { fireEvent, render, screen, testBoards as boards } from '../../utils/test-utils';
import BoardList from './BoardList';
import '@testing-library/jest-dom';
import { ReactElement, act } from 'react';
import BoardListContextProvider, { BoardListContextProps } from '../../store/BoardListContext';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter() {
        return {
            query: { boardId: boards[1].uuid }, // Marketing Plan is selected
            asPath: '/boards',
        };
    },
}));

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

describe('Board List', () => {
    test('Renders each board', async () => {
        await renderWithCtx(<BoardList />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links.length).toEqual(3);
    });

    test('Can be rendered with no boards', async () => {
        await renderWithCtx(<BoardList />, { ...providerProps, boards: [] });
        const links = screen.queryAllByRole('link');
        expect(links.length).toEqual(0);
    });

    test('Renders each board name', async () => {
        await renderWithCtx(<BoardList />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveTextContent('Platform Launch');
        expect(links[1]).toHaveTextContent('Marketing Plan');
        expect(links[2]).toHaveTextContent('Roadmap');
    });

    test('Renders each board link', async () => {
        await renderWithCtx(<BoardList />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', `/board/${boards[0].uuid}`);
        expect(links[1]).toHaveAttribute('href', `/board/${boards[1].uuid}`);
        expect(links[2]).toHaveAttribute('href', `/board/${boards[2].uuid}`);
    });

    test('Link to current board is active', async () => {
        await renderWithCtx(<BoardList />, providerProps);
        const links = screen.getAllByRole('link');
        expect(links[0]).not.toHaveClass('bg-primary');
        expect(links[1]).toHaveClass('bg-primary');
        expect(links[2]).not.toHaveClass('bg-primary');
    });

    test('onBoardSelect is called when a board is clicked', async () => {
        const mockFn = jest.fn();
        await renderWithCtx(<BoardList handleBoardSelect={mockFn} />, providerProps);
        const links = screen.getAllByRole('link');
        for (const link of links) {
            link.addEventListener('click', (event) => event.preventDefault(), false);
        }
        fireEvent.click(links[0]);
        expect(mockFn).toHaveBeenCalledTimes(1);
        fireEvent.click(links[1]);
        expect(mockFn).toHaveBeenCalledTimes(2);
        fireEvent.click(links[2]);
        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    test('Header is displayed', async () => {
        const result = await renderWithCtx(<BoardList />, providerProps);
        const header = result.container.querySelector('#board-count');
        expect(header).toBeInTheDocument();
        expect(header).toBeVisible();
        expect(header).toHaveTextContent('All Boards');
    });

    test('Header contains the number of boards', async () => {
        const result = await renderWithCtx(<BoardList />, providerProps);
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (3)');
    });

    test('Header contains the number of boards when there are no boards', async () => {
        const result = await renderWithCtx(<BoardList />, { ...providerProps, boards: [] });
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (0)');
    });

    test('New Board button is rendered when boards exist', async () => {
        await renderWithCtx(<BoardList />, providerProps);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
        expect(button).toBeEnabled();
        expect(button).toHaveTextContent('+ Create New Board');
    });

    test('New Board button is rendered if no boards exist', async () => {
        await renderWithCtx(<BoardList />, providerProps);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
        expect(button).toBeEnabled();
        expect(button).toHaveTextContent('+ Create New Board');
    });
});
