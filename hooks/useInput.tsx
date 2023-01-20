import { useState } from 'react';

type InputHook<T> = {
    value: T | undefined;
    isValid: boolean;
    hasError: boolean;
    errorMsg: string;
    setIsTouched: (val: boolean) => void;
    valueChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    customValueChangeHandler: (val: T) => void;
    inputBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;
};

function useInput<T>(validateFn: (value: T) => [boolean, string]): InputHook<T> {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [isTouched, setIsTouched] = useState(false);

    const [isValid, errorMsg] = validateFn(value as T);
    const hasError = !isValid && isTouched;

    const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as T);
    };

    const customValueChangeHandler = (val: T) => {
        setValue(val);
    };

    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsTouched(true);
    };

    return {
        value,
        isValid,
        hasError,
        errorMsg,
        valueChangeHandler,
        customValueChangeHandler,
        inputBlurHandler,
        setIsTouched,
    };
}

export default useInput;
