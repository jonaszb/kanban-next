import { useState } from 'react';
import type { MultiInputChangeEvent } from '../types';

type InputHook<T> = {
    value: T | undefined;
    isValid?: boolean;
    hasError?: boolean;
    errorMsg?: string;
    setIsTouched: (val: boolean) => void;
    valueChangeHandler: (e: MultiInputChangeEvent) => void;
    customValueChangeHandler: (val: T) => void;
    inputBlurHandler: (e: MultiInputChangeEvent) => void;
};

function useInput<T>(options?: { validateFn?: (value: T) => [boolean, string] }): InputHook<T> {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [isTouched, setIsTouched] = useState(false);

    const [isValid, errorMsg] = options?.validateFn ? options.validateFn(value as T) : [true, ''];
    const hasError = !isValid && isTouched;

    const valueChangeHandler = (e: MultiInputChangeEvent) => {
        setValue(e.target.value as T);
    };

    const customValueChangeHandler = (val: T) => {
        setValue(val);
    };

    const inputBlurHandler = (e: MultiInputChangeEvent) => {
        setIsTouched(true);
    };

    if (!options?.validateFn) {
        return {
            value,
            valueChangeHandler,
            customValueChangeHandler,
            inputBlurHandler,
            setIsTouched,
        };
    }

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
