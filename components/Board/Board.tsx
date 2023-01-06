import { FC } from 'react';
import Column from './Column/Column';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, MeasuringStrategy } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragMoveEvent, DragCancelEvent } from '@dnd-kit/core';

const testColumns = [
    {
        name: 'todo',
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
    {
        name: 'doing',
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
];

const Board: FC<{ boardUUID: string }> = (props) => {
    const handleDragStart = (event: DragStartEvent) => {
        console.log(event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        console.log(event);
    };

    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor);

    const sensors = useSensors(mouseSensor, touchSensor);

    return (
        <section className="grid h-full w-full auto-cols-min grid-flow-col gap-6">
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
            >
                {testColumns.map((column, i) => (
                    <Column key={i} name={column.name} color={column.color} tasks={column.tasks} />
                ))}
            </DndContext>
        </section>
    );
};

export default Board;
