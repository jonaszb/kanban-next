import { FC, useEffect, useState } from 'react';
import Column from './Column/Column';
import { DragStartEvent, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import {
    DndContext,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    MeasuringStrategy,
    UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Board as BoardT, Column as ColumnType, Columns, Task } from '../../types';
import { fetcher } from '../../utils/utils';
import useSWR from 'swr';

const Board: FC<{ boardUUID: string }> = (props) => {
    const boardData = useSWR<BoardT>(`/api/boards/${props.boardUUID}`, fetcher);
    const [items, setItems] = useState<Columns>({});
    const [clonedItems, setClonedItems] = useState<Columns | null>(items);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    useEffect(() => {
        const newValue: Columns = {};
        if (!boardData.data) return;
        boardData.data.columns.sort((a: ColumnType, b: ColumnType) => a.position - b.position);
        for (const column of boardData.data.columns) {
            column.tasks?.sort((a: Task, b: Task) => a.position - b.position);
            newValue[column.name] = {
                uuid: column.uuid,
                color: column.color,
                tasks: column.tasks ?? [],
            };
        }
        setItems(newValue);
    }, [boardData.data?.columns]);

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

        return Object.keys(items).find((key) => items[key].tasks.some((task) => task.name === id));
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;
        const startingContainer = findContainer(id, items);
        const taskObject = startingContainer && items[startingContainer].tasks.find((task) => task.name === id);
        if (taskObject) {
            setDraggedTask(taskObject);
            setActiveId(id);
            setClonedItems(items);
        } else {
            return;
        }
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
            const activeIndex = activeItems.map((task) => task.name).indexOf(id);
            const overIndex = overItems.map((task) => task.name).indexOf(overId);

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
                    tasks: [...prev[activeContainer].tasks.filter((task) => task.name !== active.id)],
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

        const startingIndex = clonedItems[startingContainer].tasks.map((task) => task.name).indexOf(activeId);
        const activeIndex = items[activeContainer].tasks.map((task) => task.name).indexOf(id);
        const overIndex = items[overContainer].tasks.map((task) => task.name).indexOf(overId);

        if (activeIndex !== overIndex) {
            setItems((items) => ({
                ...items,
                [overContainer]: {
                    ...items[overContainer],
                    tasks: arrayMove(items[overContainer].tasks, activeIndex, overIndex),
                },
            }));
        }
        if (activeId && clonedItems && draggedTask) {
            const dragData = {
                overIndex: overIndex !== -1 ? overIndex : items[overContainer].tasks.length - 1,
                overContainer: items[overContainer].uuid,
            };

            fetch(`/api/tasks/${draggedTask.uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    column_uuid: dragData.overContainer,
                    position: dragData.overIndex,
                }),
            }).then(() => {
                boardData.mutate();
            });
        }
        setClonedItems(null);
        setActiveId(null);
    }

    return (
        <section className="grid w-full auto-cols-min grid-flow-col gap-6">
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
                {items &&
                    Object.entries(items).map(([colName, colData]) => {
                        return <Column key={colName} name={colName} color={colData.color} tasks={colData.tasks} />;
                    })}
            </DndContext>
        </section>
    );
};

export default Board;
