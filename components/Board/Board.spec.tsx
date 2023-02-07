import { render, screen } from '../../utils/test-utils';
import Board from './Board';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import { enableFetchMocks } from 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';
import React from 'react';
enableFetchMocks();

const boardUUID = uuidv4();

const payload = {
    uuid: boardUUID,
    name: 'Test two',
    columns: [
        {
            name: 'todo',
            position: 1,
            color: '#49C4E5',
            tasks: [
                {
                    uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc4',
                    name: 'Placeholder 1',
                    description: null,
                    position: 1,
                    subtasks: [
                        {
                            uuid: '68f4754c-fde6-4596-a46c-b137b31b3f31',
                            name: 'a',
                            completed: true,
                        },
                        {
                            uuid: 'b3064841-10ad-4b65-a823-f06922c6e449',
                            name: 'b',
                            completed: false,
                        },
                        {
                            uuid: '7ba031f4-b561-4d80-813a-7c3b0bdc69aa',
                            name: 'c',
                            completed: false,
                        },
                    ],
                },
            ],
        },
        {
            name: 'doing',
            position: 2,
            color: '#8471F2',
            tasks: [
                {
                    uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc4',
                    name: 'Placeholder 2',
                    description: null,
                    position: 1,
                    subtasks: [
                        {
                            uuid: '68f4754c-fde6-4596-a46c-b137b31b3f31',
                            name: 'a',
                            completed: true,
                        },
                        {
                            uuid: 'b3064841-10ad-4b65-a823-f06922c6e449',
                            name: 'b',
                            completed: false,
                        },
                        {
                            uuid: '7ba031f4-b561-4d80-813a-7c3b0bdc69aa',
                            name: 'c',
                            completed: false,
                        },
                    ],
                },
                {
                    uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc5',
                    name: 'Placeholder 3',
                    description: null,
                    position: 2,
                    subtasks: [
                        {
                            uuid: '68f4754c-fde6-4596-a46c-b137b31b3f32',
                            name: 'a',
                            completed: false,
                        },
                        {
                            uuid: 'b3064841-10ad-4b65-a823-f06922c6e448',
                            name: 'b',
                            completed: false,
                        },
                    ],
                },
            ],
        },
        { name: 'finished', position: 3, color: '#67E2AE', tasks: [] },
    ],
};

fetchMock.mockResponse(JSON.stringify(payload));

jest.mock('next/router', () => ({
    useRouter() {
        return {
            query: { boardId: boardUUID },
            asPath: '/boards',
        };
    },
}));

const testUUID = uuidv4();

describe('Board', () => {
    test('All columns are displayed', async () => {
        render(<Board boardUUID={testUUID} />);
        const columns = await screen.findAllByTestId('board-column');
        expect(columns.length).toEqual(3);
    });

    test('Column headers contain the name and task count', async () => {
        render(<Board boardUUID={testUUID} />);
        const columns = await screen.findAllByTestId('board-column');
        expect(columns[0]).toHaveTextContent('todo (1)');
        expect(columns[1]).toHaveTextContent('doing (2)');
        expect(columns[2]).toHaveTextContent('finished (0)');
    });

    test('Columns have correct color indicators', async () => {
        render(<Board boardUUID={testUUID} />);
        const indicator = await screen.findAllByTestId('column-color');
        expect(indicator[0]).toHaveStyle('background-color: rgb(73, 196, 229)'); // #49C4E5
        expect(indicator[1]).toHaveStyle('background-color: rgb(132, 113, 242)'); // #8471F2
        expect(indicator[2]).toHaveStyle('background-color: rgb(103, 226, 174)'); // #67E2AE
    });

    test('Columns have correct task counts', async () => {
        render(<Board boardUUID={testUUID} />);
        const columns = await screen.findAllByTestId('board-column');
        const todoTasks = columns[0].querySelectorAll('li');
        const doingTasks = columns[1].querySelectorAll('li');
        const doneTasks = columns[2].querySelectorAll('li');
        expect(todoTasks.length).toEqual(1);
        expect(doingTasks.length).toEqual(2);
        expect(doneTasks.length).toEqual(0);
    });
});
