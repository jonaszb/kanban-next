import { fireEvent, render, screen } from '../../utils/test-utils';
import ColorPicker from './ColorPicker';
import '@testing-library/jest-dom';
import React from 'react';

const colorPickerProps = {
    initialColor: '#FF00FF',
    onSubmit: () => {},
    setColor: () => {},
};

describe('ColorPicker', () => {
    test('should contain the color picker, input and button', () => {
        render(<ColorPicker {...colorPickerProps} />);
        const colorPicker = screen.getByTestId('color-picker');
        const input = screen.getByTestId('color-input');
        const button = screen.getByTestId('color-submit');
        expect(colorPicker).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    test('Input should contain the initial color', () => {
        render(<ColorPicker {...colorPickerProps} />);
        const input = screen.getByTestId('color-input');
        expect(input).toHaveValue('FF00FF');
    });

    test('should execute setColor callback (on input)', () => {
        const mockFn = jest.fn();
        render(<ColorPicker {...colorPickerProps} setColor={mockFn} />);
        const input: HTMLInputElement = screen.getByTestId('color-input');
        fireEvent.change(input, { target: { value: '#FFFFFF' } });
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should execute onSubmit callback', () => {
        const mockFn = jest.fn();
        render(<ColorPicker {...colorPickerProps} onSubmit={mockFn} />);
        const button = screen.getByTestId('color-submit');
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('can be rendered with a custom className', () => {
        render(<ColorPicker {...colorPickerProps} className="test" />);
        const colorPicker = screen.getByTestId('color-picker-container');
        expect(colorPicker).toHaveClass('test');
    });
});
