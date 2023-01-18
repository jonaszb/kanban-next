import { render, screen } from '../../../utils/test-utils';
import Header from './Header';
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

describe('Header', () => {
    test('Board name is displayed if provided', async () => {
        const result = render(<Header boards={boards} selectedBoard={boards[1].name} />);
        const header = result.container.querySelector('#board-header');
        expect(header).toBeVisible();
        expect(header).toHaveTextContent('Marketing Plan');
    });

    test('Board name is not displayed if not provided', async () => {
        const result = render(<Header boards={boards} />);
        const header = result.container.querySelector('#board-header');
        expect(header).toBeEmptyDOMElement();
    });

    test('New Task button is displayed', async () => {
        const result = render(<Header boards={boards} />);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeVisible();
        expect(button).toHaveTextContent('+ Add New Task');
    });

    test('New Task button is disabled if no board is selected', async () => {
        const result = render(<Header boards={boards} />);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeDisabled();
    });

    test('New Task button is enabled if a board is selected', async () => {
        const result = render(<Header boards={boards} selectedBoard={boards[1].name} />);
        const button = result.container.querySelector('#new-task');
        expect(button).toBeEnabled();
    });

    test('Board Options button is displayed', async () => {
        const result = render(<Header boards={boards} />);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeVisible();
    });

    test('Board Options button is enabled if a board is selected', async () => {
        const result = render(<Header boards={boards} selectedBoard={boards[1].name} />);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeEnabled();
    });

    test('Board Options button is disabled if no board is selected', async () => {
        const result = render(<Header boards={boards} />);
        const button = result.container.querySelector('#board-options');
        expect(button).toBeDisabled();
    });
});
