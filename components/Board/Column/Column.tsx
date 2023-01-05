import { FC } from 'react';
import Task from '../Task/Task';
import ColumnHeader from './ColumnHeader';

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
        <div className="w-72">
            <ColumnHeader color={props.color} name={props.name} taskCount={props.tasks.length} />
            {props.tasks.map((task, i) => (
                <Task key={i} title={task.title} subtasksDone={task.subtasksDone} subtasksTotal={task.subtasksTotal} />
            ))}
        </div>
    );
};

export default Column;
