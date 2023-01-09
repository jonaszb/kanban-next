import { FC } from 'react';
import Task from '../Task/Task';
import ColumnHeader from './ColumnHeader';
import { UniqueIdentifier } from '@dnd-kit/core';
import Droppable from '../../Drag-and-drop/Droppable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type Column = {
    name: UniqueIdentifier;
    color: string;
    tasks: {
        title: UniqueIdentifier;
        subtasksDone: number;
        subtasksTotal: number;
    }[];
};

const Column: FC<Column> = (props) => {
    return (
        <Droppable droppableId={props.name} className="w-72" data-testId="board-column">
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
