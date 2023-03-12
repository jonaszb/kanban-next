import TaskElem from './Task';
import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';

const taskData = {
    uuid: '707022e2-2abe-499a-b0b6-a440b1abfcc4',
    column_uuid: uuidv4(),
    name: 'Task title',
    description: '',
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
};

export default {
    title: 'Components/Task',
    component: TaskElem,
} as Meta<typeof TaskElem>;

export const Dark: StoryFn<typeof TaskElem> = (args) => {
    return (
        <ul className="w-72">
            <TaskElem {...args} />
        </ul>
    );
};

export const Light = Dark.bind({});

Dark.args = {
    taskData: taskData,
};

Dark.parameters = {
    theme: 'dark',
    backgrounds: { default: 'dark' },
};

Light.args = {
    taskData: taskData,
};

Light.parameters = {
    theme: 'light',
    backgrounds: { default: 'light' },
};
