import BoardElem from './Board';
import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import fetchMock from 'fetch-mock';

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
                    uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc5',
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
                    uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc6',
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

export default {
    title: 'Components/Board',
    component: BoardElem,
} as Meta<typeof BoardElem>;

export const DarkTheme: StoryFn<typeof BoardElem> = (args) => {
    fetchMock.restore().mock(`/api/boards/${boardUUID}`, payload);
    fetchMock.mock(/\/api\/tasks\/.*/, 200);
    return <BoardElem {...args} />;
};
export const LightTheme = DarkTheme.bind({});

DarkTheme.args = {
    boardUUID: boardUUID,
};

DarkTheme.parameters = {
    theme: 'dark',
};

LightTheme.args = {
    boardUUID: boardUUID,
};

LightTheme.parameters = {
    theme: 'light',
    backgrounds: { default: 'light' },
};
