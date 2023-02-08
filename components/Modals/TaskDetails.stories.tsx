import TaskDetailsElem from './TaskDetails';
import Modal from './Modal';
import type { Meta, StoryFn } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { Column } from '../../types';

export default {
    title: 'Components/Modals',
    component: TaskDetailsElem,
} as Meta<typeof TaskDetailsElem>;

const testColumn = {
    id: 1,
    name: 'To do',
    board_uuid: '123',
    position: 0,
    color: '#356c5a',
};

const taskData = {
    id: 975,
    uuid: 'ff00433a-f51f-476f-b31d-510cafdf1252',
    name: 'Research pricing points of various competitors and trial different business models',
    description:
        "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
    position: 0,
    column_uuid: '9284205e-c343-4033-90ca-3c2bb6d330d2',
    subtasks: [
        {
            id: 321,
            uuid: 'fc1945ef-db94-4a97-b09d-8e48cadefcb4',
            name: 'Research competitor pricing and business models',
            task_uuid: 'ff00433a-f51f-476f-b31d-510cafdf1252',
            completed: true,
        },
        {
            id: 322,
            uuid: '889af91e-b5da-4748-a551-5f16f767cb91',
            name: 'Outline a business model that works for our solution',
            task_uuid: 'ff00433a-f51f-476f-b31d-510cafdf1252',
            completed: false,
        },
        {
            id: 323,
            uuid: '6915730a-8349-48a1-89ca-c3e7488dd6d6',
            name: 'Surveying and testing',
            task_uuid: 'ff00433a-f51f-476f-b31d-510cafdf1252',
            completed: false,
        },
    ],
};

const TaskDetails: StoryFn<typeof TaskDetailsElem> = (args) => {
    fetchMock.restore().mock('/api/tasks/uuid', taskData);
    return (
        <Modal closeModal={() => {}}>
            <TaskDetailsElem closeModal={() => {}} taskUUID="uuid" columns={[testColumn as Column]} />
        </Modal>
    );
};

export const TaskDetailsLight = TaskDetails.bind({});
TaskDetailsLight.parameters = {
    theme: 'light',
};

export const TaskDetailsDark = TaskDetails.bind({});
TaskDetailsDark.parameters = {
    theme: 'dark',
};
