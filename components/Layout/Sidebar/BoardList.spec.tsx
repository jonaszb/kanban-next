import { fireEvent, render, screen } from '../../../utils/test-utils';
import BoardList from './BoardList';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';

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

jest.mock('next/router', () => ({
    useRouter() {
        return {
            query: { boardId: boards[1].uuid }, // Marketing Plan is selected
            asPath: '/boards',
        };
    },
}));

describe('Board List', () => {
    test('Renders each board', () => {
        render(<BoardList boards={boards} />);
        const links = screen.getAllByRole('link');
        expect(links.length).toEqual(3);
    });

    test('Can be rendered with no boards', () => {
        render(<BoardList boards={[]} />);
        const links = screen.queryAllByRole('link');
        expect(links.length).toEqual(0);
    });

    test('Renders each board name', () => {
        render(<BoardList boards={boards} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveTextContent('Platform Launch');
        expect(links[1]).toHaveTextContent('Marketing Plan');
        expect(links[2]).toHaveTextContent('Roadmap');
    });

    test('Renders each board link', async () => {
        render(<BoardList boards={boards} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', `/board/${boards[0].uuid}`);
        expect(links[1]).toHaveAttribute('href', `/board/${boards[1].uuid}`);
        expect(links[2]).toHaveAttribute('href', `/board/${boards[2].uuid}`);
    });

    test('Link to current board is active', async () => {
        render(<BoardList boards={boards} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).not.toHaveClass('bg-primary');
        expect(links[1]).toHaveClass('bg-primary');
        expect(links[2]).not.toHaveClass('bg-primary');
    });

    test('onBoardSelect is called when a board is clicked', async () => {
        let i = 0;
        render(<BoardList boards={boards} onBoardSelect={() => i++} />);
        const links = screen.getAllByRole('link');
        fireEvent.click(links[0]);
        expect(i).toEqual(1);
        fireEvent.click(links[1]);
        expect(i).toEqual(2);
        fireEvent.click(links[2]);
        expect(i).toEqual(3);
    });

    test('Header is displayed', async () => {
        const result = render(<BoardList boards={boards} />);
        const header = result.container.querySelector('#board-count');
        expect(header).toBeInTheDocument();
        expect(header).toBeVisible();
        expect(header).toHaveTextContent('All Boards');
    });

    test('Header contains the number of boards', async () => {
        const result = render(<BoardList boards={boards} />);
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (3)');
    });

    test('Header contains the number of boards when there are no boards', async () => {
        const result = render(<BoardList boards={[]} />);
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (0)');
    });

    test('New Board button is rendered when boards exist', async () => {
        render(<BoardList boards={boards} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
        expect(button).toBeEnabled();
        expect(button).toHaveTextContent('+ Create New Board');
    });

    test('New Board button is rendered if no boards exist', async () => {
        render(<BoardList boards={[]} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
        expect(button).toBeEnabled();
        expect(button).toHaveTextContent('+ Create New Board');
    });
});
