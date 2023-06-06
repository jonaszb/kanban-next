import { Dispatch, FC, MouseEventHandler, SetStateAction, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { ButtonPrimary } from '../Buttons/Buttons';
import { Input } from '../Inputs/Inputs';

type ColorPickerProps = {
    className?: string;
    onSubmit: MouseEventHandler<HTMLButtonElement>;
    initialColor: string;
    setColor: Dispatch<SetStateAction<string>>;
};

const ColorPicker: FC<ColorPickerProps> = ({
    initialColor,
    setColor: setParentColor,
    className,
    onSubmit: submitHandler,
}) => {
    const [color, setColor] = useState(initialColor);
    return (
        <div
            data-testid="color-picker-container"
            className={`flex flex-col items-center rounded-md bg-white p-4 shadow-lg dark:bg-dark-grey dark:shadow-menu-dark ${
                className ?? ''
            }`}
        >
            <HexColorPicker
                data-testid="color-picker"
                className="w-full"
                color={color}
                onChange={(newColor) => {
                    setColor(newColor);
                    setParentColor(newColor);
                }}
            />
            <HexColorInput
                data-testid="color-input"
                className="mt-4 w-full bg-transparent text-center outline-none"
                color={color}
                onChange={(newColor) => {
                    setColor(newColor);
                    setParentColor(newColor);
                }}
            />
            <ButtonPrimary data-testid="color-submit" onClick={submitHandler} className="mt-4">
                Confirm
            </ButtonPrimary>
        </div>
    );
};

export default ColorPicker;
