import { FC } from 'react';
import useInput from '../../hooks/useInput';
import { Board, MultiInput } from '../../types';
import { ButtonPrimary } from '../Buttons/Buttons';
import { Input, MultiValueInput } from '../Inputs/Inputs';

// Validate input length - must be between 1 and 20 characters. Return tuple of boolean and error message.
const validateName = (val: string | undefined): [boolean, string] => {
    if (!val || val?.trim().length < 1) return [false, "Can't be empty"];
    if (val?.trim().length > 20) return [false, `${val.trim().length}/20`];
    return [true, ''];
};

const validateColumns = (val: MultiInput[]): [boolean, string] => {
    if (val?.length === 0 || !val) return [true, ''];
    for (const item of val) {
        const [isValid, errorMessage] = validateName(item.value);
        if (!isValid) return [isValid, errorMessage];
    }
    return [true, ''];
};

const BoardForm: FC<{
    onNewBoardCreated?: Function;
    onBoardUpdated?: Function;
    boardData?: Board;
    formType: 'new' | 'edit';
}> = (props) => {
    const initialColumns: MultiInput[] | undefined = props.boardData?.columns
        ?.sort((a, b) => a.position - b.position)
        .map((column) => {
            return { id: column.id.toString(), value: column.name, isValid: true, isTouched: false, errorMsg: '' };
        });
    const nameInput = useInput<string>({ validateFn: validateName, initialValue: props.boardData?.name });
    const columnsInput = useInput<MultiInput[]>({ validateFn: validateColumns, initialValue: initialColumns });

    const formIsValid = nameInput.isValid && columnsInput.isValid;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nameInput.setIsTouched(true);
        columnsInput.setIsTouched(true);
        const newColumnsValue = columnsInput.value?.map((item) => {
            const [isValid, errorMsg] = validateName(item.value);
            return { ...item, isValid, errorMsg, isTouched: true };
        });
        if (newColumnsValue) columnsInput.customValueChangeHandler(newColumnsValue);
        if (formIsValid) {
            if (props.formType === 'new') {
                const columns = columnsInput.value?.map((item) => {
                    return { name: item.value, color: `#${Math.floor(Math.random() * 16777215).toString(16)}` };
                });

                fetch('/api/boards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        columns: columns,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        props.onNewBoardCreated && props.onNewBoardCreated(data.uuid);
                    });
            } else {
                const columns = [];
                if (columnsInput.value) {
                    for (const [i, column] of columnsInput.value.entries()) {
                        const existingColumn = props.boardData?.columns?.find((col) => col.id.toString() === column.id);
                        if (existingColumn) {
                            columns.push({
                                uuid: existingColumn.uuid,
                                color: existingColumn.color,
                                name: column.value,
                                position: i,
                            });
                        } else {
                            columns.push({
                                name: column.value,
                                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                position: i,
                            });
                        }
                    }
                }
                fetch(`/api/boards/${props.boardData?.uuid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        columns: columns,
                    }),
                }).then(() => {
                    props.onBoardUpdated && props.onBoardUpdated();
                });
            }
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="mb-6 text-lg font-bold dark:text-white">
                {props.formType === 'new' ? 'Add New Board' : 'Edit Board'}
            </h2>
            <form onSubmit={handleSubmit} action="submit" className="flex flex-col">
                <Input
                    value={nameInput.value ?? ''}
                    onChange={nameInput.valueChangeHandler}
                    onBlur={nameInput.inputBlurHandler}
                    haserror={nameInput.hasError}
                    errorMsg={nameInput.errorMsg}
                    label="Board Name"
                    id="board-name"
                    placeholder="e.g. Web Design"
                    className="mb-6"
                />
                <MultiValueInput
                    id="board-columns"
                    placeholder="e.g. To Do"
                    label="Board Columns"
                    className="mb-6"
                    values={columnsInput.value}
                    changeHandler={columnsInput.customValueChangeHandler}
                    validationHandler={validateName}
                    addBtnText="+ Add New Column"
                />
                <ButtonPrimary data-testid="board-submit">
                    {props.formType === 'new' ? 'Create New Board' : 'Save Changes'}
                </ButtonPrimary>
            </form>
        </div>
    );
};

export default BoardForm;
