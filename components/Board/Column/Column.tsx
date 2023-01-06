import { FC } from 'react';
import Task from '../Task/Task';
import ColumnHeader from './ColumnHeader';
import Droppable from '../../Drag-and-drop/Droppable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type Column = {
    name: string;
    color: string;
    tasks: {
        title: string;
        subtasksDone: number;
        subtasksTotal: number;
    }[];
};

const Column: FC<Column> = (props) => {
    return (
        <Droppable id={props.name} className="w-72">
            <ColumnHeader color={props.color} name={props.name} taskCount={props.tasks.length} />
            <ul>
                <SortableContext items={props.tasks.map((task) => task.title)} strategy={verticalListSortingStrategy}>
                    {props.tasks.map((task, i) => (
                        <Task
                            key={i}
                            title={task.title}
                            subtasksDone={task.subtasksDone}
                            subtasksTotal={task.subtasksTotal}
                        />
                    ))}
                </SortableContext>
            </ul>
        </Droppable>
    );
};

export default Column;
