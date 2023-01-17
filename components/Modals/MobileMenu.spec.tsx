import { fireEvent, render, screen } from '../../utils/test-utils';
import MobileMenu from './MobileMenu';
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
        };
    },
}));

const menuProps = {
    boards: boards,
    onChangeTheme: jest.fn(),
    darkModeEnabled: false,
    setMenuIsOpen: jest.fn(),
};

describe('Mobile menu', () => {
    test('Renders each board', () => {
        render(<MobileMenu {...menuProps} />);
        const links = screen.getAllByRole('link');
        expect(links.length).toEqual(3);
    });

    test('Can be rendered with no boards', () => {
        render(<MobileMenu {...menuProps} boards={[]} />);
        const links = screen.queryAllByRole('link');
        expect(links.length).toEqual(0);
    });

    test('Renders each board name', () => {
        render(<MobileMenu {...menuProps} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveTextContent('Platform Launch');
        expect(links[1]).toHaveTextContent('Marketing Plan');
        expect(links[2]).toHaveTextContent('Roadmap');
    });

    test('Renders each board link', async () => {
        render(<MobileMenu {...menuProps} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', `/board/${boards[0].uuid}`);
        expect(links[1]).toHaveAttribute('href', `/board/${boards[1].uuid}`);
        expect(links[2]).toHaveAttribute('href', `/board/${boards[2].uuid}`);
    });

    test('Link to current board is active', async () => {
        render(<MobileMenu {...menuProps} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).not.toHaveClass('bg-primary');
        expect(links[1]).toHaveClass('bg-primary');
        expect(links[2]).not.toHaveClass('bg-primary');
    });

    test('Header contains the number of boards', async () => {
        const result = render(<MobileMenu {...menuProps} />);
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (3)');
    });

    test('Header contains the number of boards when there are no boards', async () => {
        const result = render(<MobileMenu {...menuProps} boards={[]} />);
        const header = result.container.querySelector('#board-count');
        expect(header).toHaveTextContent('All Boards (0)');
    });

    test('Clicking the backdrop closes the menu', async () => {
        const mockFn = jest.fn();
        render(<MobileMenu {...menuProps} setMenuIsOpen={mockFn} />);
        const backdrop = screen.getByTestId('modal-backdrop');
        fireEvent.click(backdrop);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('Selecting a board closes the modal', async () => {
        const mockFn = jest.fn();
        render(<MobileMenu {...menuProps} setMenuIsOpen={mockFn} />);
        const links = screen.getAllByRole('link');
        fireEvent.click(links[0]);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('Clicking the currently selected board closes the modal', async () => {
        const mockFn = jest.fn();
        render(<MobileMenu {...menuProps} setMenuIsOpen={mockFn} />);
        const links = screen.getAllByRole('link');
        fireEvent.click(links[1]);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('Modal stays open if other menu elements are clicked (not links or backdrop)', async () => {
        const mockFn = jest.fn();
        render(<MobileMenu {...menuProps} setMenuIsOpen={mockFn} />);
        const heading = screen.getByRole('heading');
        const themeToggle = screen.getByRole('switch');
        fireEvent.click(heading);
        fireEvent.click(themeToggle);
        expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test('Clicking the theme toggle calls the onChangeTheme prop', async () => {
        const mockFn = jest.fn();
        render(<MobileMenu {...menuProps} onChangeTheme={mockFn} />);
        const themeToggle = screen.getByRole('switch');
        fireEvent.click(themeToggle);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
