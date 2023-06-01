import { FC, useRef, useState } from 'react';
import Task from '../Task/Task';
import { UniqueIdentifier } from '@dnd-kit/core';
import Droppable from '../../Drag-and-drop/Droppable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task as TaskType } from '../../../types';
import useClickOutside from '../../../hooks/useClickOutside';
import ColorPicker from '../../ColorPicker/ColorPicker';
import { mutate } from 'swr';

type ColumnData = {
    color: string;
    tasks: TaskType[];
    uuid: string;
    board_uuid: string;
};

type ColumnProps = {
    name: UniqueIdentifier;
    columnData: ColumnData;
};

type ColumnHeaderProps = {
    name: string;
    columnData: ColumnData;
};

const ColumnHeader: FC<ColumnHeaderProps> = ({ name, columnData }) => {
    const [color, setColor] = useState(columnData.color);
    const [pickerIsOpen, setPickerIsOpen] = useState(false);

    const pickerRef = useRef<HTMLDivElement>(null);
    const colorIndicatorRef = useRef<HTMLButtonElement>(null);

    useClickOutside(pickerRef, (e) => {
        if (e.target === colorIndicatorRef.current) return;
        setColor(columnData.color);
        setPickerIsOpen(false);
    });

    const handlePickerToggle = () => {
        if (pickerIsOpen) setColor(columnData.color); // reset color if picker is closed without saving
        setPickerIsOpen(!pickerIsOpen);
    };

    const colorChangeHandler = () => {
        fetch(`/api/columns/${columnData.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                color,
            }),
        }).then(() => {
            mutate(`/api/boards/${columnData.board_uuid}`);
            setPickerIsOpen(false);
        });
    };

    return (
        <>
            <div className="relative mb-6 flex">
                <button
                    ref={colorIndicatorRef}
                    data-testid="column-color"
                    className={`mr-3 h-4 w-4 rounded-full`}
                    style={{ backgroundColor: color }}
                    onClick={handlePickerToggle}
                />
                {pickerIsOpen && (
                    <div ref={pickerRef}>
                        <ColorPicker
                            className="absolute top-6"
                            initialColor={columnData.color}
                            setColor={setColor}
                            onSubmit={colorChangeHandler}
                        />
                    </div>
                )}

                <h3
                    data-testid="column-header"
                    className="text-xs font-bold uppercase tracking-[.2rem] dark:text-mid-grey"
                >
                    {name} {`(${columnData.tasks.length})`}
                </h3>
            </div>
        </>
    );
};
const Column: FC<ColumnProps> = ({ name, columnData }) => {
    return (
        <Droppable droppableId={name} className="z-10 h-min w-72" data-testid="board-column">
            <ColumnHeader name={name.toString()} columnData={columnData} />
            <SortableContext items={columnData.tasks.map((task) => task.uuid)} strategy={verticalListSortingStrategy}>
                <ul>
                    {columnData.tasks.map((task, i) => (
                        <Task key={i} taskData={task} />
                    ))}
                </ul>
            </SortableContext>
        </Droppable>
    );
};

export default Column;
