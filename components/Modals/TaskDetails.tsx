import { FC, MouseEventHandler, useRef, useState } from 'react';
import { mutate } from 'swr';
import useInput from '../../hooks/useInput';
import useModal from '../../hooks/useModal';
import usePopover from '../../hooks/usePopover';
import { useBoardsContext } from '../../store/BoardListContext';
import { Column, Subtask, Task } from '../../types';
import { VerticalEllipsisIcon } from '../Icons/Icons';
import { Checkbox, Dropdown } from '../Inputs/Inputs';

const SubtaskRow: FC<{ subtask: Subtask; i: number }> = ({ subtask, i }) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const boardData = useBoardsContext().selectedBoard;

    const subtaskClickHandler = async () => {
        await fetch(`/api/subtasks/${subtask.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !subtask.completed,
            }),
        });
        mutate(`/api/boards/${boardData!.uuid}`);
    };

    return (
        <li
            key={subtask.uuid}
            className="mb-2 flex cursor-pointer items-center gap-4 rounded bg-light-grey p-3 hover:bg-primary hover:bg-opacity-25"
            onClick={subtaskClickHandler}
        >
            <Checkbox
                className="pointer-events-none"
                ref={checkboxRef}
                checked={subtask.completed}
                id={`subtask-checkbox-${i + 1}`}
            />
            <span
                className={`text-xs font-medium text-black transition-all ${
                    subtask.completed ? 'line-through opacity-50' : ''
                }`}
            >
                {subtask.name}
            </span>
        </li>
    );
};

const TaskDetails: FC<{ taskData: Task; columns: Column[]; closeModal: Function }> = ({
    taskData,
    columns,
    closeModal,
}) => {
    const columnDropdown = useInput<string>({
        initialValue: columns.find((col) => col.uuid === taskData.column_uuid)?.name,
    });
    const checkboxRef = useRef<HTMLInputElement>(null);

    const { Link, LinkContainer, Component: OptionsPopover, ...optionsPopover } = usePopover();
    const { selectedBoard } = useBoardsContext();

    const handleOptionsClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        optionsPopover.toggle(e);
    };

    const modalTitle = 'Delete this task?';
    const modalMessage = `Are you sure you want to delete the ‘${taskData.name}’ task? This action cannot be reversed.`;

    const confirmDeleteHandler = async () => {
        await fetch(`/api/tasks/${taskData.uuid}`, {
            method: 'DELETE',
        });
        // TODO: Fix modal flickering on delete
        mutate(`/api/boards/${selectedBoard?.uuid}`);
        closeModal();
    };

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

    const statusChangeHandler = async (val: string) => {
        const column = columns.find((col) => col.name === val);
        if (column?.uuid && column.uuid !== taskData.column_uuid) {
            await fetch(`/api/tasks/${taskData.uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    column_uuid: column.uuid,
                }),
            });
            mutate(`/api/boards/${selectedBoard?.uuid}`);
        }
    };

    const completedTasks = taskData.subtasks.filter((subtask) => subtask.completed).length;
    return (
        <div className={deleteTaskModal.isOpen ? 'hidden' : ''}>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold dark:text-white">{taskData.name}</h2>
                <button className="h-5 pl-5" onClick={handleOptionsClick}>
                    <VerticalEllipsisIcon className="pointer-events-none" />
                </button>
                <OptionsPopover className="mt-8 -translate-x-16">
                    <LinkContainer>
                        <Link id="task-edit" onClick={() => {}}>
                            Edit Task
                        </Link>
                        <Link id="task-delete" onClick={taskDeleteHandler} danger>
                            Delete Task
                        </Link>
                    </LinkContainer>
                </OptionsPopover>
                <DeleteTaskModal />
            </div>
            <p className="mb-6 text-sm font-medium leading-6 text-mid-grey">{taskData.description}</p>
            <span className="text-sm font-bold text-mid-grey dark:text-white">
                {`Subtasks (${completedTasks} of ${taskData.subtasks.length})`}
            </span>
            <ul className="mt-4 mb-6">
                {taskData.subtasks.map((subtask, i) => (
                    <SubtaskRow key={subtask.uuid} subtask={subtask} i={i} />
                ))}
            </ul>
            <label
                htmlFor="column-select"
                className="pointer-events-none text-sm font-bold text-mid-grey dark:text-white"
            >
                Current status
            </label>
            <Dropdown
                className="mt-2"
                setValue={columnDropdown.setValue}
                value={columnDropdown.value}
                id="column-select"
                options={columns.map((col) => col.name)}
                onValueSelected={statusChangeHandler}
            />
        </div>
    );
};

export default TaskDetails;
