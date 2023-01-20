import { FC } from 'react';
import useInput from '../../hooks/useInput';
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

const NewBoardForm: FC<{ closeModal: Function }> = (props) => {
    const nameInput = useInput<string>(validateName);
    const columnsInput = useInput<MultiInput[]>(validateColumns);

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
        console.log(`formIsValid: ${formIsValid}`);
        console.log(`nameInput.isValid: ${nameInput.isValid}`);
        console.log(`columnsInput.isValid: ${columnsInput.isValid}`);
        console.log(`Board Name: ${nameInput.value}`);
        console.log('Board Columns: ', columnsInput.value);
        if (formIsValid) {
            props.closeModal();
        }
    };

    return (
        <div className="flex flex-col dark:text-white">
            <h2 className="mb-6 text-lg font-bold">Add New Board</h2>
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
                    placeholder="e.g. To Do"
                    label="Board Columns"
                    className="mb-6"
                    values={columnsInput.value}
                    changeHandler={columnsInput.customValueChangeHandler}
                    validationHandler={validateName}
                />
                <ButtonPrimary>Create New Board</ButtonPrimary>
            </form>
        </div>
    );
};

export default NewBoardForm;
