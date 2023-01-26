import { render, screen } from '../../utils/test-utils';
import Board from './Board';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import { Columns } from '../../types';

const testUUID = uuidv4();
const testColumns: Columns = {
    todo: {
        color: '#49C4E5',
        tasks: [
            {
                title: 'Placeholder 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
        ],
    },
    doing: {
        color: '#8471F2',
        tasks: [
            {
                title: 'Placeholder 2',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Placeholder 3',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
        ],
    },
    finished: {
        color: '#67E2AE',
        tasks: [],
    },
};

describe('Board', () => {
    test('All columns are displayed', async () => {
        render(<Board boardUUID={testUUID} columns={testColumns} />);
        const columns = await screen.findAllByTestId('board-column');
        expect(columns.length).toEqual(3);
    });

    test('Column headers contain the name and task count', async () => {
        render(<Board boardUUID={testUUID} columns={testColumns} />);
        const columns = await screen.findAllByTestId('board-column');
        expect(columns[0]).toHaveTextContent('todo (1)');
        expect(columns[1]).toHaveTextContent('doing (2)');
        expect(columns[2]).toHaveTextContent('finished (0)');
    });

    test('Columns have correct color indicators', async () => {
        render(<Board boardUUID={testUUID} columns={testColumns} />);
        const indicator = await screen.findAllByTestId('column-color');
        expect(indicator[0]).toHaveStyle('background-color: rgb(73, 196, 229)'); // #49C4E5
        expect(indicator[1]).toHaveStyle('background-color: rgb(132, 113, 242)'); // #8471F2
        expect(indicator[2]).toHaveStyle('background-color: rgb(103, 226, 174)'); // #67E2AE
    });

    test('Columns have correct task counts', async () => {
        render(<Board boardUUID={testUUID} columns={testColumns} />);
        const columns = await screen.findAllByTestId('board-column');
        const todoTasks = columns[0].querySelectorAll('li');
        const doingTasks = columns[1].querySelectorAll('li');
        const doneTasks = columns[2].querySelectorAll('li');
        expect(todoTasks.length).toEqual(1);
        expect(doingTasks.length).toEqual(2);
        expect(doneTasks.length).toEqual(0);
    });
});
