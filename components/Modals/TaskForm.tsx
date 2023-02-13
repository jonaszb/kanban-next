import { FC } from 'react';
import useInput from '../../hooks/useInput';
import { Column, MultiInput, Task } from '../../types';
import { ButtonPrimary } from '../Buttons/Buttons';
import { Dropdown, Input, MultiValueInput, Textarea } from '../Inputs/Inputs';
import { mutate } from 'swr';

const validateTitle = (val: string | undefined): [boolean, string] => {
    if (!val || val?.trim().length < 1) return [false, "Can't be empty"];
    if (val?.trim().length > 100) return [false, `${val?.trim().length}/100`];
    return [true, ''];
};

const validateSubtasks = (val: MultiInput[]): [boolean, string] => {
    if (val?.length === 0 || !val) return [true, ''];
    for (const item of val) {
        const [isValid, errorMessage] = validateTitle(item.value);
        if (!isValid) return [isValid, errorMessage];
    }
    return [true, ''];
};

const TaskForm: FC<{
    closeModal: Function;
    columns?: Column[];
    taskData?: Task;
    formType: 'new' | 'edit';
    onTaskUpdated?: Function;
}> = (props) => {
    // Set initial field values if editing an existing task
    const initialSubtasks = props.taskData?.subtasks?.map((subtask) => {
        return { id: subtask.uuid, value: subtask.name, isValid: true, isTouched: false, errorMsg: '' };
    });
    const initialColumn = props.columns?.find((column) => column.uuid === props.taskData?.column_uuid)?.name;

    const dropdownOptions = props.columns?.map((item) => item.name);
    const nameInput = useInput<string>({ validateFn: validateTitle, initialValue: props.taskData?.name });
    const descriptionInput = useInput<string>({ initialValue: props.taskData?.description });
    const subtasksInput = useInput<MultiInput[]>({ validateFn: validateSubtasks, initialValue: initialSubtasks });
    const columnDropdown = useInput<string>({ initialValue: initialColumn ?? (dropdownOptions && dropdownOptions[0]) });

    const formIsValid = nameInput.isValid && subtasksInput.isValid;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nameInput.setIsTouched(true);
        subtasksInput.setIsTouched(true);
        const newColumnsValue = subtasksInput.value?.map((item) => {
            const [isValid, errorMsg] = validateTitle(item.value);
            return { ...item, isValid, errorMsg, isTouched: true };
        });
        if (newColumnsValue) subtasksInput.customValueChangeHandler(newColumnsValue);
        if (formIsValid) {
            const formData = {
                name: nameInput.value,
                description: descriptionInput.value,
                subtasks: subtasksInput.value?.map((item) => {
                    const subtask = props.taskData?.subtasks?.find((subtask) => subtask.uuid === item.id);
                    if (subtask) return { uuid: subtask.uuid, name: item.value };
                    return { name: item.value };
                }),
                column_uuid: props.columns?.find((item) => item.name === columnDropdown.value)?.uuid,
            };
            if (props.formType === 'new') {
                fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }).then(() => {
                    mutate(`/api/boards/${props.columns?.[0].board_uuid}`);
                    props.closeModal();
                });
            } else {
                fetch(`/api/tasks/${props.taskData?.uuid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }).then(() => {
                    props.onTaskUpdated && props.onTaskUpdated();
                });
            }
        }
    };

    return (
        <div data-testid="task-form" className="flex flex-col">
            <h2 className="mb-6 text-lg font-bold dark:text-white">
                {props.formType === 'new' ? 'Add New Task' : 'Edit Task'}
            </h2>
            <form onSubmit={handleSubmit} action="submit" className="flex flex-col">
                <Input
                    value={nameInput.value ?? ''}
                    onChange={nameInput.valueChangeHandler}
                    onBlur={nameInput.inputBlurHandler}
                    haserror={nameInput.hasError}
                    errorMsg={nameInput.errorMsg}
                    label="Title"
                    id="task-title"
                    placeholder="e.g. Take a coffee break"
                    className="mb-6"
                />
                <Textarea
                    value={descriptionInput.value ?? ''}
                    onChange={descriptionInput.valueChangeHandler}
                    onBlur={descriptionInput.inputBlurHandler}
                    label="Description"
                    id="task-description"
                    placeholder="e.g. It’s always good to take a break. This 15 minute break will 
                    recharge the batteries a little."
                    className="mb-6"
                />
                <MultiValueInput
                    id="subtasks"
                    placeholder="e.g. To Do"
                    label="Subtasks"
                    className="mb-6"
                    values={subtasksInput.value}
                    changeHandler={subtasksInput.customValueChangeHandler}
                    validationHandler={validateTitle}
                    addBtnText="+ Add New Subtask"
                    fieldType="textarea"
                />
                {dropdownOptions && (
                    <Dropdown
                        setValue={columnDropdown.setValue}
                        value={columnDropdown.value}
                        id="column-select"
                        label="Status"
                        className="mb-6"
                        options={dropdownOptions}
                    />
                )}
                <ButtonPrimary data-testid="task-submit">
                    {props.formType === 'new' ? 'Create New Task' : 'Save Changes'}
                </ButtonPrimary>
            </form>
        </div>
    );
};

export default TaskForm;
