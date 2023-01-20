import React, { FC } from 'react';
import { MultiInput } from '../../types';
import { ButtonSecondary } from '../Buttons/Buttons';
import { Cross } from '../Icons/Icons';

const FormFieldLabel: FC<React.ComponentProps<'label'>> = (props) => {
    const { className, ...labelProps } = props;
    return (
        <label {...labelProps} className={`pointer-events-none mb-2 text-sm ${className ?? ''}`}>
            {props.children}
        </label>
    );
};

const InputField: FC<React.ComponentProps<'input'> & { haserror?: boolean; errorMsg?: string }> = (props) => {
    const { className, haserror, errorMsg, ...inputProps } = props;
    return (
        <div className="relative w-full">
            <input
                {...inputProps}
                className={`${
                    haserror
                        ? 'border-danger pr-36'
                        : 'border-mid-grey border-opacity-25 hover:border-primary focus:border-primary'
                } h-10 w-full cursor-pointer rounded border-2   bg-transparent py-2 px-4 text-sm font-medium text-black placeholder-white placeholder-opacity-25 outline-none focus:placeholder-opacity-0 dark:text-inherit ${
                    className ?? ''
                }`}
            />
            {haserror && errorMsg && (
                <span className="absolute top-2 right-4 whitespace-nowrap text-danger">{errorMsg}</span>
            )}
        </div>
    );
};

const Input: FC<React.ComponentProps<'input'> & { label: string; haserror?: boolean; errorMsg?: string }> = (props) => {
    const { label, className, ...inputProps } = props;
    return (
        <fieldset className={`flex flex-col text-mid-grey dark:text-white ${className ?? ''}`}>
            <FormFieldLabel htmlFor={props.id}>{props.label}</FormFieldLabel>
            <InputField {...inputProps} />
        </fieldset>
    );
};

type MultiValueInputProps = React.ComponentProps<'fieldset'> & {
    label: string;
    changeHandler: Function;
    values?: MultiInput[];
    validationHandler: (val: string | undefined) => [boolean, string];
};

const MultiValueInput: FC<MultiValueInputProps> = (props) => {
    const values = props.values ?? [];
    const setValues = props.changeHandler;
    const [id, setId] = React.useState(1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        const newValues: MultiInput[] = values.map((item) => {
            if (item.id === id) {
                const [isValid, errorMsg] = props.validationHandler(value);
                return { ...item, value, isValid, errorMsg, isTouched: true };
            }
            return item;
        });
        setValues(newValues);
    };

    const onNewColumn = () => {
        const newValues = [...values, { value: '', id: `${id}`, isValid: false, isTouched: false }];
        setValues(newValues);
        setId((prev) => prev + 1);
    };

    const handleDeleteInput = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const { id } = e.currentTarget;
        const newValues = values.filter((item) => item.id !== id.replace('delete-', ''));
        setValues(newValues);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        const newValues: MultiInput[] = values.map((item) => {
            if (item.id === id) {
                const [isValid, errorMsg] = props.validationHandler(value);
                return { ...item, value, isValid, errorMsg, isTouched: true };
            }
            return item;
        });
        setValues(newValues);
    };

    return (
        <div className={props.className}>
            <fieldset className="flex flex-col text-mid-grey dark:text-white">
                <FormFieldLabel htmlFor={props.id}>{props.label}</FormFieldLabel>

                {values.map((item) => (
                    <div key={item.id} className="mb-3 flex items-center">
                        <InputField
                            id={item.id}
                            onChange={handleInputChange}
                            className="w-full"
                            value={item.value}
                            placeholder={props.placeholder}
                            haserror={!item.isValid && item.isTouched}
                            errorMsg={item.errorMsg}
                            onBlur={handleBlur}
                        />
                        <Cross
                            id={`delete-${item.id}`}
                            onClick={handleDeleteInput}
                            className="ml-4 cursor-pointer fill-mid-grey hover:fill-red-500"
                        />
                    </div>
                ))}
            </fieldset>
            <ButtonSecondary type="button" onClick={onNewColumn}>
                + Add New Column
            </ButtonSecondary>
        </div>
    );
};

export { Input, MultiValueInput };
