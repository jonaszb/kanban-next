import { FC } from 'react';
import Task from '../Task/Task';
import { UniqueIdentifier } from '@dnd-kit/core';
import Droppable from '../../Drag-and-drop/Droppable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type ColumnProps = {
    name: UniqueIdentifier;
    color: string;
    tasks: {
        title: UniqueIdentifier;
        subtasksDone: number;
        subtasksTotal: number;
    }[];
};

type ColumnHeaderProps = {
    name: string;
    color: string;
    taskCount: number;
};

const ColumnHeader: FC<ColumnHeaderProps> = (props) => {
    return (
        <div className="mb-6 flex">
            <div
                data-testid="column-color"
                className={`mr-3 h-4 w-4 rounded-full`}
                style={{ backgroundColor: props.color }}
            />
            <h3 className="text-xs font-bold uppercase tracking-[.2rem] dark:text-mid-grey">
                {props.name} {`(${props.taskCount})`}
            </h3>
        </div>
    );
};
const Column: FC<ColumnProps> = (props) => {
    return (
        <Droppable droppableId={props.name} className="w-72" data-testid="board-column">
            <ColumnHeader color={props.color} name={props.name.toString()} taskCount={props.tasks.length} />
            <SortableContext items={props.tasks.map((task) => task.title)} strategy={verticalListSortingStrategy}>
                <ul>
                    {props.tasks.map((task, i) => (
                        <Task
                            key={i}
                            title={task.title.toString()}
                            subtasksDone={task.subtasksDone}
                            subtasksTotal={task.subtasksTotal}
                        />
                    ))}
                </ul>
            </SortableContext>
        </Droppable>
    );
};

export default Column;
