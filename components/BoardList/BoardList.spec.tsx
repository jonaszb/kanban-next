import { fireEvent, render, screen } from '../../utils/test-utils';
import BoardList from './BoardList';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import { ReactElement } from 'react';
import BoardListContextProvider, { BoardListContextProps } from '../../store/BoardListContext';
import React from 'react';
import { Board } from '../../types';
import { act } from 'react-dom/test-utils';

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
            asPath: '/boards',
        };
    },
}));

jest.spyOn(React, 'useEffect').mockImplementation((f) => {});

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
