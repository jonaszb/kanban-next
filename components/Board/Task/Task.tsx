import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';

const Task: FC<{ title: string; subtasksDone: number; subtasksTotal: number }> = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.title });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              transition,
          }
        : undefined;

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => console.log(`Clicked task ${props.title}`)}
            data-testid="task"
            className="group mb-5 cursor-pointer rounded-md bg-white px-4 py-6 text-left font-bold shadow-md dark:bg-dark-grey"
        >
            <h4 className="text-sm text-black group-hover:text-primary dark:text-inherit">{props.title}</h4>
            {props.subtasksTotal > 0 && (
                <span className="mt-2 text-xs text-mid-grey">{`${props.subtasksDone} of ${props.subtasksTotal} subtasks done`}</span>
            )}
        </li>
    );
};

export default Task;
