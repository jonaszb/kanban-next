import { FC } from 'react';
import useInput from '../../hooks/useInput';
import { useBoardsContext } from '../../store/BoardListContext';
import { MultiInput } from '../../types';
import { ButtonPrimary } from '../Buttons/Buttons';
import { Input, MultiValueInput } from '../Inputs/Inputs';

// Validate input length - must be between 1 and 20 characters. Return tuple of boolean and error message.
const validateName = (val: string | undefined): [boolean, string] => {
    if (!val || val?.trim().length < 1) return [false, "Can't be empty"];
    if (val?.trim().length > 20) return [false, 'Name too long'];
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

const NewBoardForm: FC<{ onNewBoardCreated: Function }> = (props) => {
    const nameInput = useInput<string>({ validateFn: validateName });
    const columnsInput = useInput<MultiInput[]>({ validateFn: validateColumns });

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
                    props.onNewBoardCreated(data.uuid);
                });
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="mb-6 text-lg font-bold dark:text-white">Add New Board</h2>
            <form onSubmit={handleSubmit} action="submit" className="flex flex-col">
                <Input
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
                <ButtonPrimary>Create New Board</ButtonPrimary>
            </form>
        </div>
    );
};

export default NewBoardForm;
