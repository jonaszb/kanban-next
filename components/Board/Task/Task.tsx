import { FC } from 'react';

const Task: FC<{ title: string; subtasksDone: number; subtasksTotal: number }> = (props) => {
    return (
        <div
            onClick={() => console.log(`Clicked task ${props.title}`)}
            className="group mb-5 cursor-pointer rounded-md bg-dark-grey px-4 py-6 text-left font-bold"
        >
            <h4 className="text-sm group-hover:text-primary">{props.title}</h4>
            {props.subtasksTotal > 0 && (
                <span className="mt-2 text-xs text-mid-grey">{`${props.subtasksDone} of ${props.subtasksTotal} subtasks done`}</span>
            )}
        </div>
    );
};

export default Task;
