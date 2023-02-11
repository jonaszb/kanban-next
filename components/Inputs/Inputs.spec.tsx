import { fireEvent, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input, Textarea, Dropdown, MultiValueInput } from './Inputs';
import React from 'react';
import { MultiInput } from '../../types';
import useInput from '../../hooks/useInput';

type MultiInputProps = {
    placeholder?: string;
    errorMsg?: string;
    hasError?: boolean;
    draggable?: boolean;
};

const validateColumns = (val: MultiInput[]): [boolean, string] => {
    if (val?.length === 0 || !val) return [true, ''];
    for (const item of val) {
        const [isValid, errorMessage] = validateName(item.value);
        if (!isValid) return [isValid, errorMessage];
    }
    return [true, ''];
};

const validateName = (val: string | undefined): [boolean, string] => {
    if (!val || val?.trim().length < 1) return [false, 'Error!'];
    if (val?.trim().length > 20) return [false, 'Error!'];
    return [true, ''];
};

const MultiInputWrapper = (props: MultiInputProps) => {
    const multiInput = useInput<MultiInput[]>({ validateFn: validateColumns });
    return (
        <MultiValueInput
            draggable={props.draggable}
            label="Test label"
            values={multiInput.value}
            changeHandler={multiInput.customValueChangeHandler}
            validationHandler={validateName}
            addBtnText="Add New"
            {...props}
        />
    );
};

const dropdownOptions = ['Todo', 'Doing', 'Done'];

describe('Custom Input', () => {
    test('Is displayed with specified label', async () => {
        await act(() => render(<Input label="Test label" />));
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('Has no placeholder by default', async () => {
        await act(() => render(<Input id="test" label="Test" />));
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('placeholder');
    });

    test('Has no value by default', async () => {
        await act(() => render(<Input id="test" label="Test" />));
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('value');
    });

    test('Can have a placeholder if specified', async () => {
        await act(() => render(<Input label="Test" placeholder="Test placeholder" />));
        const input = screen.getByPlaceholderText('Test placeholder');
        expect(input).toBeInTheDocument();
    });

    test('Can have a value if specified', async () => {
        await act(() => render(<Input label="Test" value="Test value" onChange={jest.fn()} />));
        const input = screen.getByDisplayValue('Test value');
        expect(input).toBeInTheDocument();
    });

    test('Can have a type if specified', async () => {
        await act(() => render(<Input id="test" label="Test" type="password" />));
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('type', 'password');
    });

    test('Has a label for attribute that matches the input id', async () => {
        await act(() => render(<Input id="test" label="Test" />));
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('id', 'test');
    });

    test('Can display an error message', async () => {
        await act(() => render(<Input label="Test" errorMsg="Test error" haserror={true} />));
        const error = screen.getByText('Test error');
        expect(error).toBeInTheDocument();
    });

    test('Error is not displayed if not specified', async () => {
        await act(() => render(<Input label="Test" />));
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Error is not displayed if errorMsg is specified but haserror is false', async () => {
        await act(() => render(<Input label="Test" errorMsg="Test error" />));
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Can have a custom class applied to wrapping fieldset', async () => {
        await act(() => render(<Input id="test" label="Test" className="custom-class" />));
        const fieldset = screen.getByLabelText('Test').closest('fieldset');
        expect(fieldset).toHaveClass('custom-class');
    });
});

describe('Custom Textarea', () => {
    test('Is displayed with specified label', async () => {
        await act(() => render(<Textarea id="test" label="Test label" />));
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('Has no placeholder by default', async () => {
        await act(() => render(<Textarea id="test" label="Test" />));
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('placeholder');
    });

    test('Has no value by default', async () => {
        await act(() => render(<Textarea id="test" label="Test" />));
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('value');
    });

    test('Can have a placeholder if specified', async () => {
        await act(() => render(<Textarea label="Test" placeholder="Test placeholder" />));
        const input = screen.getByPlaceholderText('Test placeholder');
        expect(input).toBeInTheDocument();
    });

    test('Can have a value if specified', async () => {
        await act(() => render(<Textarea label="Test" value="Test value" onChange={jest.fn()} />));
        const input = screen.getByDisplayValue('Test value');
        expect(input).toBeInTheDocument();
    });

    test('Has a label for attribute that matches the input id', async () => {
        await act(() => render(<Textarea id="test" label="Test" />));
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('id', 'test');
    });

    test('Can display an error message', async () => {
        await act(() => render(<Textarea label="Test" errorMsg="Test error" haserror={true} />));
        const error = screen.getByText('Test error');
        expect(error).toBeInTheDocument();
    });

    test('Error is not displayed if not specified', async () => {
        await act(() => render(<Textarea label="Test" />));
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Error is not displayed if errorMsg is specified but haserror is false', async () => {
        await act(() => render(<Textarea label="Test" errorMsg="Test error" />));
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Can have a custom class applied to wrapping fieldset', async () => {
        await act(() => render(<Textarea id="test" label="Test" className="custom-class" />));
        const fieldset = screen.getByLabelText('Test').closest('fieldset');
        expect(fieldset).toHaveClass('custom-class');
    });
});

describe('Custom Dropdown', () => {
    test('Is displayed with specified label', async () => {
        await act(() =>
            render(<Dropdown setValue={() => {}} id="test" label="Test label" options={dropdownOptions} />)
        );
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('First option is selected by default', async () => {
        await act(() => render(<Dropdown setValue={() => {}} id="test" label="Test" options={dropdownOptions} />));
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('value');
    });

    test('Can have a value if specified', async () => {
        await act(() =>
            render(
                <Dropdown
                    setValue={() => {}}
                    id="test"
                    label="Test"
                    options={dropdownOptions}
                    value="Done"
                    onChange={jest.fn()}
                />
            )
        );
        const input = screen.getByDisplayValue('Done');
        expect(input).toBeInTheDocument();
    });

    test('Has a label for attribute that matches the input id', async () => {
        await act(() => render(<Dropdown setValue={() => {}} id="test" label="Test" options={dropdownOptions} />));
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('id', 'test');
    });

    test('Can have a custom class applied to wrapping fieldset', async () => {
        await act(() =>
            render(
                <Dropdown
                    setValue={() => {}}
                    id="test"
                    label="Test"
                    options={dropdownOptions}
                    className="custom-class"
                />
            )
        );
        const fieldset = screen.getByLabelText('Test').closest('fieldset');
        expect(fieldset).toHaveClass('custom-class');
    });
});

describe('MultiValueInput', () => {
    test('Is displayed with specified label', async () => {
        await act(() => render(<MultiInputWrapper />));
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('Renders the add button', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        expect(button).toBeInTheDocument();
    });

    test('Add button creates a new input field', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        expect(input).toBeInTheDocument();
    });

    test('New input has no value by default', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        expect(input).toHaveValue('');
    });

    test('Input has no error state when created', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        await screen.findByTestId('multi-input-field');
        const error = screen.queryByText('Error!');
        expect(error).not.toBeInTheDocument();
    });

    test('Input has error state when blurred', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        fireEvent.blur(input);
        const error = screen.getByText('Error!');
        expect(error).toBeInTheDocument();
    });

    test('Error state is removed when valid value is entered', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        fireEvent.blur(input);
        fireEvent.change(input, { target: { value: 'Test' } });
        const error = screen.queryByText('Error!');
        expect(error).not.toBeInTheDocument();
    });

    test('Drag handle is not displayed when a single input is present', async () => {
        await act(() => render(<MultiInputWrapper draggable={true} />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        await screen.findByTestId('multi-input-field');
        const handle = screen.queryByTestId('multi-input-drag');
        expect(handle).not.toBeInTheDocument();
    });

    test('Drag handle is displayed when multiple inputs are present', async () => {
        await act(() => render(<MultiInputWrapper draggable={true} />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        fireEvent.click(button);
        const handles = await screen.findAllByTestId('multi-input-drag');
        expect(handles.length).toEqual(2);
    });

    test('Drag handle is not displayed when a single input is present (drag disabled)', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        await screen.findByTestId('multi-input-field');
        const handle = screen.queryByTestId('multi-input-drag');
        expect(handle).not.toBeInTheDocument();
    });

    test('Drag handle is not displayed when multiple inputs are present (drag disabled)', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        fireEvent.click(button);
        const handles = await screen.queryAllByTestId('multi-input-drag');
        expect(handles.length).toEqual(0);
    });

    test('Delete icon removes the input when clicked', async () => {
        await act(() => render(<MultiInputWrapper />));
        const button = screen.getByText('Add New');
        await act(() => fireEvent.click(button));
        const input = await screen.findByTestId('multi-input-field');
        const deleteIcon = screen.getByTestId('multi-input-delete');
        await act(async () => {
            fireEvent.click(deleteIcon);
            await new Promise((r) => setTimeout(r, 300)); // wait for animation to finish
        });
        expect(input).not.toBeInTheDocument();
    });
});
