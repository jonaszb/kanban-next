import type { Meta, StoryFn } from '@storybook/react';
import ColorPickerElem from './ColorPicker';

export default {
    title: 'Components/ColorPicker',
    component: ColorPickerElem,
} as Meta<typeof ColorPickerElem>;

const pickerProps = {
    initialColor: '#FF00FF',
    onSubmit: () => {},
    setColor: () => {},
};

export const ColorPicker: StoryFn<typeof ColorPickerElem> = () => {
    return (
        <div className="w-max">
            <ColorPickerElem {...pickerProps} />
        </div>
    );
};

ColorPicker.parameters = {
    theme: 'light',
};
