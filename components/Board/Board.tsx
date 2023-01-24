import { FC, useEffect, useState } from 'react';
import Column from './Column/Column';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    MeasuringStrategy,
    UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Columns } from '../../types';

const Board: FC<{ boardUUID: string; columns: Columns }> = (props) => {
    const [items, setItems] = useState<Columns>(props.columns);
    const [clonedItems, setClonedItems] = useState<Columns | null>(items);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 10,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    function findContainer(id: UniqueIdentifier, items: Columns | null) {
        if (!items) return null;
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].tasks.some((task) => task.title === id));
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
        setClonedItems(items);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        const { id } = active;
        const overId = over?.id;
        if (!overId) return;

        // Find the containers
        const activeContainer = findContainer(id, items);
        const overContainer = findContainer(overId, items);

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
        if (!overId || !clonedItems || !activeId) return;

        const activeContainer = findContainer(id, items);
        const overContainer = findContainer(overId, items);
        const startingContainer = findContainer(activeId, clonedItems);

        if (!activeContainer || !overContainer || !startingContainer) {
            return;
        }

        const startingIndex = clonedItems[startingContainer].tasks.map((task) => task.title).indexOf(activeId);
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
        if (activeId && clonedItems) {
            console.log(
                `Moved ${id} from ${startingIndex} in ${startingContainer} to ${overIndex} in ${overContainer}`
            );
        }
        setClonedItems(null);
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
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {props.columns &&
                    Object.entries(props.columns).map(([colName, colData]) => {
                        return <Column key={colName} name={colName} color={colData.color} tasks={colData.tasks} />;
                    })}
            </DndContext>
        </section>
    );
};

export default Board;
