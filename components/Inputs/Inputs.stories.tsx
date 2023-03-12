import {
    Input as InputElem,
    Textarea as TextareaElem,
    Dropdown as DropdownElem,
    MultiValueInput as MultiValueInputElem,
    Checkbox as CheckboxElem,
} from './Inputs';
import type { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Components/Inputs',
    component: InputElem,
} as Meta<typeof InputElem>;

export const Input: StoryFn<typeof InputElem> = (args) => {
    return <InputElem label="Test input" />;
};
Input.parameters = {
    theme: 'light',
    backgrounds: { default: 'light' },
};
export const InputDark = Input.bind({});
InputDark.parameters = {
    theme: 'dark',
};

export const Textarea: StoryFn<typeof TextareaElem> = (args) => {
    const { label, ...rest } = args;
    return <TextareaElem label="Test textarea" {...rest} />;
};
Textarea.parameters = {
    theme: 'light',
    backgrounds: { default: 'light' },
};
export const TextareaDark = Textarea.bind({});
TextareaDark.parameters = {
    theme: 'dark',
};

export const TextareaSmall = Textarea.bind({});
TextareaSmall.args = {
    small: true,
};

export const Dropdown: StoryFn<typeof DropdownElem> = (args) => {
    return (
        <div id="popover-root">
            <DropdownElem setValue={() => {}} label="Test dropdown" options={['Todo', 'Doing', 'Done']} />
        </div>
    );
};
Dropdown.parameters = {
    theme: 'light',
    backgrounds: { default: 'light' },
};
export const DropdownDark = Dropdown.bind({});
DropdownDark.parameters = {
    theme: 'dark',
};

export const MultiValueInput: StoryFn<typeof MultiValueInputElem> = (args) => {
    return (
        <div id="popover-root">
            <MultiValueInputElem
                draggable={args.draggable}
                label="Test multi value input"
                changeHandler={() => {}}
                addBtnText="Add"
                placeholder="Enter a value"
                validationHandler={(val) => [true, '']}
                values={args.values}
                fieldType={args.fieldType}
            />
        </div>
    );
};

MultiValueInput.args = {
    values: [{ id: '1', value: 'Test' }],
};

export const MultiValueInputSeveralValues = MultiValueInput.bind({});
MultiValueInputSeveralValues.args = {
    draggable: true,
    values: [
        { id: '1', value: 'Test' },
        { id: '2', value: '', errorMsg: "Can't be empty", isValid: false, isTouched: true },
        { id: '3', value: 'Test 2' },
    ],
};

export const MultiValueInputTextarea = MultiValueInput.bind({});
MultiValueInputTextarea.args = {
    draggable: false,
    fieldType: 'textarea',
    values: [
        { id: '1', value: 'Test' },
        { id: '2', value: '', errorMsg: "Can't be empty", isValid: false, isTouched: true },
        { id: '3', value: 'Test 2' },
    ],
};

export const Checkbox: StoryFn<typeof CheckboxElem> = (args) => {
    return <CheckboxElem className="w-5" {...args} />;
};
Checkbox.argTypes = {
    checked: { control: 'boolean' },
};
Checkbox.args = {
    checked: true,
};
