import { render, screen } from '../../../utils/test-utils';
import Task from './Task';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';

const taskData = {
    uuid: uuidv4(),
    column_uuid: uuidv4(),
    name: 'Placeholder 1',
    description: '',
    position: 1,
    subtasks: [
        {
            uuid: uuidv4(),
            name: 'a',
            completed: false,
        },
        {
            uuid: uuidv4(),
            name: 'b',
            completed: false,
        },
        {
            uuid: uuidv4(),
            name: 'c',
            completed: false,
        },
    ],
};

describe('Task', () => {
    test('Renders Task component', () => {
        render(<Task taskData={taskData} />);
        expect(screen.getByTestId('task')).toBeInTheDocument();
    });

    test('Renders Task component with title', () => {
        render(<Task taskData={taskData} />);
        expect(screen.getByText('Placeholder 1')).toBeInTheDocument();
    });

    test('Renders Task component with subtasks', () => {
        render(<Task taskData={taskData} />);
        expect(screen.getByText('0 of 3 subtasks done')).toBeInTheDocument();
    });

    test('Contains number of subtasks done/total', () => {
        const data = { ...taskData, subtasks: [...taskData.subtasks, { uuid: uuidv4(), name: 'd', completed: true }] };
        render(<Task taskData={data} />);
        expect(screen.getByText('1 of 4 subtasks done')).toBeInTheDocument();
    });

    test('Can render a task with no subtasks', () => {
        const data = { ...taskData, subtasks: [] };
        const { container } = render(<Task taskData={data} />);
        expect(container.querySelector('span')).not.toBeInTheDocument();
    });
});
