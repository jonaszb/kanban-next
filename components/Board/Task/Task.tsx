import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Task } from '../../../types';

const Task: FC<{ taskData: Task }> = ({ taskData }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: taskData.name });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              transition,
          }
        : undefined;

    const completedTasks = taskData.subtasks.filter((subtask) => subtask.completed).length;

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => console.log(`Clicked task ${taskData.name}`)}
            data-testid="task"
            className="group mb-5 cursor-pointer rounded-md bg-white px-4 py-6 text-left font-bold shadow-md dark:bg-dark-grey"
        >
            <h4 className="text-sm text-black group-hover:text-primary dark:text-white">{taskData.name}</h4>
            {taskData.subtasks.length > 0 && (
                <span className="mt-2 text-xs text-mid-grey">{`${completedTasks} of ${taskData.subtasks.length} subtasks done`}</span>
            )}
        </li>
    );
};

export default Task;
