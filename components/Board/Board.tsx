import { FC } from 'react';
import Column from './Column/Column';

const testColumns = [
    {
        name: 'todo',
        color: '#49C4E5',
        tasks: [
            {
                title: 'Task 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Task 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Task 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
        ],
    },
    {
        name: 'doing',
        color: '#8471F2',
        tasks: [
            {
                title: 'Doing 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Doing 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Doing 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
            {
                title: 'Doing 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Doing 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Doing 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
            {
                title: 'Doing 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Doing 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Doing 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
            {
                title: 'Doing 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Doing 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Doing 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
            {
                title: 'Doing 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Doing 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Doing 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
        ],
    },
];

const Board: FC<{ boardUUID: string }> = (props) => {
    return (
        <section className="grid h-full w-full auto-cols-min grid-flow-col gap-6">
            {testColumns.map((column, i) => (
                <Column key={i} name={column.name} color={column.color} tasks={column.tasks} />
            ))}
        </section>
    );
};

export default Board;
