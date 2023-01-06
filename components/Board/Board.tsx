import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Column from './Column/Column';
import type { DragStartEvent, DragEndEvent, DragMoveEvent, DragCancelEvent, DragOverEvent } from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    MeasuringStrategy,
    UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

type Items = Record<
    UniqueIdentifier,
    { color: string; tasks: { title: UniqueIdentifier; subtasksDone: number; subtasksTotal: number }[] }
>;

const testColumns: Items = {
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
        color: '#777777',
        tasks: [],
    },
};

const Board: FC<{ boardUUID: string }> = (props) => {
    const [items, setItems] = useState(testColumns);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor);

    const sensors = useSensors(mouseSensor, touchSensor);

    function findContainer(id: UniqueIdentifier) {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].tasks.some((task) => task.title === id));
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        const { id } = active;
        const overId = over?.id;
        if (!overId) return;

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);
        console.log(overContainer);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer].tasks;
            const overItems = prev[overContainer].tasks;

            // Find the indexes for the items
            const activeIndex = activeItems.map((task) => task.title).indexOf(id);
            const overIndex = overItems.map((task) => task.title).indexOf(overId);

            let newIndex;
            if (overId in prev) {
                // We're at the root droppable of a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem = over && overIndex === overItems.length - 1;
                // &&
                // draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: {
                    ...prev[activeContainer],
                    tasks: [...prev[activeContainer].tasks.filter((task) => task.title !== active.id)],
                },
                [overContainer]: {
                    ...prev[overContainer],
                    tasks: [
                        ...prev[overContainer].tasks.slice(0, newIndex),
                        items[activeContainer].tasks[activeIndex],
                        ...prev[overContainer].tasks.slice(newIndex, prev[overContainer].tasks.length),
                    ],
                },
            };
        });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const { id } = active;
        const overId = over?.id;
        if (!overId) return;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            return;
        }

        const activeIndex = items[activeContainer].tasks.map((task) => task.title).indexOf(id);
        const overIndex = items[overContainer].tasks.map((task) => task.title).indexOf(overId);

        if (activeIndex !== overIndex) {
            setItems((items) => ({
                ...items,
                [overContainer]: {
                    ...items[overContainer],
                    tasks: arrayMove(items[overContainer].tasks, activeIndex, overIndex),
                },
            }));
        }

        setActiveId(null);
    }

    return (
        <section className="grid h-full w-full auto-cols-min grid-flow-col gap-6">
            <DndContext
                sensors={sensors}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {Object.entries(items).map(([colName, colData]) => {
                    return <Column key={colName} name={colName} color={colData.color} tasks={colData.tasks} />;
                })}
            </DndContext>
        </section>
    );
};

export default Board;
