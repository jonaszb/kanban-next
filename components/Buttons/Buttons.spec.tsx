import { render, screen } from '../../utils/test-utils';
import { ButtonPrimaryLarge } from './Buttons';
import '@testing-library/jest-dom';

describe('ButtonPrimaryLarge', () => {
    test('works with children', async () => {
        render(<ButtonPrimaryLarge>Test button!</ButtonPrimaryLarge>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeInTheDocument();
    });

    test('executes onClick callback', () => {
        let clicked = false;
        render(<ButtonPrimaryLarge onClick={() => (clicked = true)}>Test</ButtonPrimaryLarge>);
        screen.getByRole('button').click();
        expect(clicked).toBe(true);
    });

    test('can be disabled', () => {
        render(<ButtonPrimaryLarge disabled>Test</ButtonPrimaryLarge>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeDisabled();
    });

    test('does not execute onClick callback if disabled', () => {
        let clicked = false;
        render(
            <ButtonPrimaryLarge disabled onClick={() => (clicked = true)}>
                Test
            </ButtonPrimaryLarge>
        );
        screen.getByRole('button').click();
        expect(clicked).toBe(false);
    });

    test('can take a custom className', () => {
        render(<ButtonPrimaryLarge className="test">Test</ButtonPrimaryLarge>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toHaveClass('test');
    });

    test('custom class name does not override default class name', () => {
        render(<ButtonPrimaryLarge className="test">Test</ButtonPrimaryLarge>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toHaveClass('bg-primary');
    });

    test('can take other button props', () => {
        render(<ButtonPrimaryLarge type="submit">Test</ButtonPrimaryLarge>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toHaveAttribute('type', 'submit');
    });
});
