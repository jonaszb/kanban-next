import BoardElem from './Board';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Columns } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const testColumns: Columns = {
    todo: {
        color: '#49C4E5',
        tasks: [
            {
                title: 'Placeholder 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Placeholder 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Placeholder 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
        ],
    },
    doing: {
        color: '#8471F2',
        tasks: [
            {
                title: 'Placeholder 4',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Placeholder 5',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
        ],
    },
    done: {
        color: '#67E2AE',
        tasks: [],
    },
};

export default {
    title: 'Components/Board',
    component: BoardElem,
} as Meta<typeof BoardElem>;

export const DarkTheme: StoryObj<typeof BoardElem> = {
    render: (args) => <BoardElem {...args} />,
    args: { columns: testColumns, boardUUID: uuidv4() },
    parameters: { theme: 'dark' },
};

export const LightTheme: StoryObj<typeof BoardElem> = {
    render: (args) => <BoardElem {...args} />,
    args: { columns: testColumns, boardUUID: uuidv4() },
};
