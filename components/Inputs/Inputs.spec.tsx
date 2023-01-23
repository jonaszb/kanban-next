import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input, Textarea, Dropdown, MultiValueInput } from './Inputs';
import React from 'react';
import { MultiInput } from '../../types';
import useInput from '../../hooks/useInput';

const menuProps = {
    setMenuIsOpen: jest.fn(),
};

type MultiInputProps = {
    placeholder?: string;
    errorMsg?: string;
    hasError?: boolean;
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
    test('Is displayed with specified label', () => {
        render(<Input label="Test label" />);
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('Has no placeholder by default', () => {
        render(<Input id="test" label="Test" />);
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('placeholder');
    });

    test('Has no value by default', () => {
        render(<Input id="test" label="Test" />);
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('value');
    });

    test('Can have a placeholder if specified', () => {
        render(<Input label="Test" placeholder="Test placeholder" />);
        const input = screen.getByPlaceholderText('Test placeholder');
        expect(input).toBeInTheDocument();
    });

    test('Can have a value if specified', () => {
        render(<Input label="Test" value="Test value" />);
        const input = screen.getByDisplayValue('Test value');
        expect(input).toBeInTheDocument();
    });

    test('Can have a type if specified', () => {
        render(<Input id="test" label="Test" type="password" />);
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('type', 'password');
    });

    test('Has a label for attribute that matches the input id', () => {
        render(<Input id="test" label="Test" />);
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('id', 'test');
    });

    test('Can display an error message', () => {
        render(<Input label="Test" errorMsg="Test error" haserror={true} />);
        const error = screen.getByText('Test error');
        expect(error).toBeInTheDocument();
    });

    test('Error is not displayed if not specified', () => {
        render(<Input label="Test" />);
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Error is not displayed if errorMsg is specified but haserror is false', () => {
        render(<Input label="Test" errorMsg="Test error" />);
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Can have a custom class applied to wrapping fieldset', () => {
        render(<Input id="test" label="Test" className="custom-class" />);
        const fieldset = screen.getByLabelText('Test').closest('fieldset');
        expect(fieldset).toHaveClass('custom-class');
    });
});

describe('Custom Textarea', () => {
    test('Is displayed with specified label', () => {
        render(<Textarea id="test" label="Test label" />);
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('Has no placeholder by default', () => {
        render(<Textarea id="test" label="Test" />);
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('placeholder');
    });

    test('Has no value by default', () => {
        render(<Textarea id="test" label="Test" />);
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('value');
    });

    test('Can have a placeholder if specified', () => {
        render(<Textarea label="Test" placeholder="Test placeholder" />);
        const input = screen.getByPlaceholderText('Test placeholder');
        expect(input).toBeInTheDocument();
    });

    test('Can have a value if specified', () => {
        render(<Textarea label="Test" value="Test value" />);
        const input = screen.getByDisplayValue('Test value');
        expect(input).toBeInTheDocument();
    });

    test('Has a label for attribute that matches the input id', () => {
        render(<Textarea id="test" label="Test" />);
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('id', 'test');
    });

    test('Can display an error message', () => {
        render(<Textarea label="Test" errorMsg="Test error" haserror={true} />);
        const error = screen.getByText('Test error');
        expect(error).toBeInTheDocument();
    });

    test('Error is not displayed if not specified', () => {
        render(<Textarea label="Test" />);
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Error is not displayed if errorMsg is specified but haserror is false', () => {
        render(<Textarea label="Test" errorMsg="Test error" />);
        const error = screen.queryByText('Test error');
        expect(error).not.toBeInTheDocument();
    });

    test('Can have a custom class applied to wrapping fieldset', () => {
        render(<Textarea id="test" label="Test" className="custom-class" />);
        const fieldset = screen.getByLabelText('Test').closest('fieldset');
        expect(fieldset).toHaveClass('custom-class');
    });
});

describe('Custom Dropdown', () => {
    test('Is displayed with specified label', () => {
        render(<Dropdown id="test" label="Test label" options={dropdownOptions} />);
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('First option is selected by default', () => {
        render(<Dropdown id="test" label="Test" options={dropdownOptions} />);
        const input = screen.getByLabelText('Test');
        expect(input).not.toHaveAttribute('value');
    });

    test('Can have a value if specified', () => {
        render(<Dropdown id="test" label="Test" options={dropdownOptions} value="Done" />);
        const input = screen.getByDisplayValue('Done');
        expect(input).toBeInTheDocument();
    });

    test('Has a label for attribute that matches the input id', () => {
        render(<Dropdown id="test" label="Test" options={dropdownOptions} />);
        const input = screen.getByLabelText('Test');
        expect(input).toHaveAttribute('id', 'test');
    });

    test('Can have a custom class applied to wrapping fieldset', () => {
        render(<Dropdown id="test" label="Test" options={dropdownOptions} className="custom-class" />);
        const fieldset = screen.getByLabelText('Test').closest('fieldset');
        expect(fieldset).toHaveClass('custom-class');
    });
});

describe('MultiValueInput', () => {
    test('Is displayed with specified label', () => {
        render(<MultiInputWrapper />);
        const label = screen.getByText('Test label');
        expect(label).toBeInTheDocument();
    });

    test('Renders the add button', () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        expect(button).toBeInTheDocument();
    });

    test('Add button creates a new input field', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        expect(input).toBeInTheDocument();
    });

    test('New input has no value by default', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        expect(input).toHaveValue('');
    });

    test('Input has no error state when created', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        await screen.findByTestId('multi-input-field');
        const error = screen.queryByText('Error!');
        expect(error).not.toBeInTheDocument();
    });

    test('Input has error state when blurred', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        fireEvent.blur(input);
        const error = screen.getByText('Error!');
        expect(error).toBeInTheDocument();
    });

    test('Error state is removed when valid value is entered', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        fireEvent.blur(input);
        fireEvent.change(input, { target: { value: 'Test' } });
        const error = screen.queryByText('Error!');
        expect(error).not.toBeInTheDocument();
    });

    test('Drag handle is not displayed when a single input is present', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        await screen.findByTestId('multi-input-field');
        const handle = screen.queryByTestId('multi-input-drag');
        expect(handle).not.toBeInTheDocument();
    });

    test('Drag handle is not displayed when a single input is present', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        fireEvent.click(button);
        const handles = await screen.findAllByTestId('multi-input-drag');
        expect(handles.length).toEqual(2);
    });

    test('Delete icon removes the input when clicked', async () => {
        render(<MultiInputWrapper />);
        const button = screen.getByText('Add New');
        fireEvent.click(button);
        const input = await screen.findByTestId('multi-input-field');
        const deleteIcon = screen.getByTestId('multi-input-delete');
        fireEvent.click(deleteIcon);
        await new Promise((r) => setTimeout(r, 300)); // wait for animation to finish
        expect(input).not.toBeInTheDocument();
    });
});