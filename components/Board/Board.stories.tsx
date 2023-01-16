import BoardElem from './Board';
import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
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
            {
                title: 'Placeholder 6',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
        ],
    },
    done: {
        color: '#67E2AE',
        tasks: [],
    },
};

export default {
    title: 'Board',
    component: BoardElem,
} as ComponentMeta<typeof BoardElem & { darkMode: boolean }>;

const Template: ComponentStory<typeof BoardElem> = (args) => <BoardElem {...args} />;

export const DarkTheme = Template.bind({});
DarkTheme.args = { columns: testColumns, boardUUID: uuidv4() };
DarkTheme.parameters = { theme: 'dark' };

export const LightTheme = Template.bind({});
LightTheme.args = DarkTheme.args;
