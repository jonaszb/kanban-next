import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { mutate } from 'swr';
import useInput from '../../hooks/useInput';
import useModal from '../../hooks/useModal';
import usePopover from '../../hooks/usePopover';
import { useBoardsContext } from '../../store/BoardListContext';
import { Column, Subtask, Task } from '../../types';
import { VerticalEllipsisIcon } from '../Icons/Icons';
import { Checkbox, Dropdown } from '../Inputs/Inputs';
import useSWR from 'swr';
import { fetcher } from '../../utils/utils';
import { LinkContainer, PopoverLink } from '../Popover/Popover';
import TaskForm from './TaskForm';
import Spinner from '../Spinner/Spinner';

const SubtaskRow: FC<{
    subtask: Subtask;
    i: number;
    setSubtaskStatus: (subtask: Subtask) => void;
    disabled: boolean;
}> = ({ subtask, i, setSubtaskStatus, disabled }) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const [isChecked, setIsChecked] = useState(subtask.completed);

    const subtaskClickHandler = async () => {
        if (disabled) return;
        const newValue = !isChecked;
        setIsChecked(newValue);
        setSubtaskStatus(subtask);
    };

    return (
        <li
            tabIndex={0}
            data-testid="subtask"
            key={subtask.uuid}
            className={`mb-2 flex cursor-pointer items-center gap-4 rounded bg-light-grey p-3 transition-all  dark:bg-v-dark-grey  ${
                isChecked ? '' : 'hover:bg-primary hover:bg-opacity-25 dark:hover:bg-primary dark:hover:bg-opacity-25'
            }`}
            onClick={subtaskClickHandler}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    subtaskClickHandler();
                }
            }}
        >
            <Checkbox
                className="pointer-events-none"
                ref={checkboxRef}
                checked={isChecked}
                id={`subtask-checkbox-${i + 1}`}
            />
            <span
                className={`text-xs font-medium text-black transition-all dark:text-white ${
                    isChecked ? 'line-through opacity-50' : ''
                }`}
            >
                {subtask.name}
            </span>
        </li>
    );
};

const TaskDetails: FC<{ taskUUID: string; columns: Column[]; closeModal: Function }> = ({
    taskUUID,
    columns,
    closeModal,
}) => {
    const { mutate: mutateTask, data: taskData } = useSWR<Task>(`/api/tasks/${taskUUID}`, fetcher, {});
    const [subtaskUpdating, setSubtaskUpdating] = useState(false);
    const { selectedBoard } = useBoardsContext();
    const columnDropdown = useInput<string>({
        initialValue: columns.find((col) => col.uuid === taskData?.column_uuid)?.name,
    });

    const { Component: OptionsPopover, ...optionsPopover } = usePopover();

    const handleOptionsClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        optionsPopover.toggle(e);
    };

    const modalTitle = 'Delete this task?';
    const modalMessage = `Are you sure you want to delete the ‘${taskData?.name}’ task? This action cannot be reversed.`;

    const confirmDeleteHandler = async () => {
        await fetch(`/api/tasks/${taskData!.uuid}`, {
            method: 'DELETE',
        });
        closeModal();
    };

    const { Component: EditTaskModal, ...editTaskModal } = useModal();

    const { Component: DeleteTaskModal, ...deleteTaskModal } = useModal({
        type: 'danger',
        dangerHeader: modalTitle,
        dangerMessage: modalMessage,
        onConfirmDelete: confirmDeleteHandler,
    });

    const taskDeleteHandler = () => {
        optionsPopover.close();
        deleteTaskModal.toggle();
    };

    const taskEditHandler = () => {
        optionsPopover.close();
        editTaskModal.toggle();
    };

    const statusChangeHandler = async (val: string) => {
        const column = columns.find((col) => col.name === val);
        if (column?.uuid && column.uuid !== taskData!.column_uuid) {
            await fetch(`/api/tasks/${taskData!.uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    column_uuid: column.uuid,
                }),
            });
            mutateTask({ ...taskData!, column_uuid: column.uuid });
            mutate(`/api/boards/${selectedBoard?.uuid}`);
        }
    };

    const subtaskChangeHandler = async (subtask: Subtask) => {
        const newSubtasks = taskData!.subtasks.map((sub) => {
            if (sub.uuid === subtask.uuid) {
                return { ...sub, completed: !sub.completed };
            }
            return sub;
        });
        setSubtaskUpdating(true);
        const fetchPromise = fetch(`/api/subtasks/${subtask.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !subtask.completed,
            }),
        });
        taskData!.subtasks = newSubtasks;
        await fetchPromise;
        setSubtaskUpdating(false);
        mutateTask({ ...taskData!, subtasks: newSubtasks });
        mutate(`/api/boards/${selectedBoard?.uuid}`);
    };

    const handleTaskUpdate = async (task: Task) => {
        mutate(`/api/boards/${selectedBoard?.uuid}`);
        mutateTask(task);
        editTaskModal.close();
    };

    const completedTasks = taskData?.subtasks.filter((subtask) => subtask.completed).length;

    useEffect(() => {
        const col = columns.find((col) => col.uuid === taskData?.column_uuid);
        if (col) columnDropdown.setValue(col.name);
    }, [taskData?.column_uuid]);

    return (
        <div data-testid="task-details" className={deleteTaskModal.isOpen || editTaskModal.isOpen ? 'hidden' : ''}>
            {taskData && !editTaskModal.isOpen ? (
                <>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 data-testid="task-name" className="text-lg font-bold dark:text-white">
                            {taskData.name}
                        </h2>
                        <button
                            data-testid="task-options"
                            className="h-5 translate-x-3 px-3"
                            onClick={handleOptionsClick}
                        >
                            <VerticalEllipsisIcon className="pointer-events-none" />
                        </button>
                        <OptionsPopover
                            className={`mt-8 ${window.innerWidth > 620 ? '-translate-x-24' : '-translate-x-44'}`}
                        >
                            <LinkContainer>
                                <PopoverLink id="task-edit" onClick={taskEditHandler}>
                                    Edit Task
                                </PopoverLink>
                                <PopoverLink id="task-delete" onClick={taskDeleteHandler} danger>
                                    Delete Task
                                </PopoverLink>
                            </LinkContainer>
                        </OptionsPopover>
                        <DeleteTaskModal />
                    </div>
                    <p
                        data-testid="task-description"
                        className="mb-6 whitespace-pre-wrap text-sm font-medium leading-6 text-mid-grey"
                    >
                        {taskData.description}
                    </p>
                    {taskData.subtasks.length > 0 && (
                        <span data-testid="subtasks-header" className="text-sm font-bold text-mid-grey dark:text-white">
                            {`Subtasks (${completedTasks} of ${taskData.subtasks.length})`}
                        </span>
                    )}
                    <ul className="mt-4 mb-6">
                        {taskData.subtasks.map((subtask, i) => (
                            <SubtaskRow
                                disabled={subtaskUpdating}
                                key={subtask.uuid}
                                subtask={subtask}
                                i={i}
                                setSubtaskStatus={subtaskChangeHandler}
                            />
                        ))}
                    </ul>
                    <label
                        htmlFor="column-select"
                        className="pointer-events-none text-sm font-bold text-mid-grey dark:text-white"
                    >
                        Current status
                    </label>
                    {
                        <Dropdown
                            className="mt-2"
                            setValue={columnDropdown.setValue}
                            value={columnDropdown.value}
                            id="column-select"
                            options={columns.map((col) => col.name)}
                            onValueSelected={statusChangeHandler}
                        />
                    }
                </>
            ) : (
                <div className="my-16 flex justify-center">
                    <Spinner />
                </div>
            )}
            <EditTaskModal>
                <TaskForm
                    formType="edit"
                    taskData={taskData}
                    closeModal={editTaskModal.close}
                    columns={columns}
                    onTaskUpdated={handleTaskUpdate}
                />
            </EditTaskModal>
        </div>
    );
};

export default TaskDetails;
