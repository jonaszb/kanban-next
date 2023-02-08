import { render, screen } from '../../utils/test-utils';
import { ButtonPrimary, ButtonSecondary, ButtonDanger, ButtonPrimaryLarge } from './Buttons';
import '@testing-library/jest-dom';

const testData = {
    ButtonPrimaryLarge: ButtonPrimaryLarge,
    ButtonPrimary: ButtonPrimary,
    ButtonSecondary: ButtonSecondary,
    ButtonDanger: ButtonDanger,
};

for (const [buttonName, ButtonComponent] of Object.entries(testData)) {
    describe(buttonName, () => {
        test('works with children', async () => {
            render(<ButtonComponent>Test button!</ButtonComponent>);
            const btnElement = screen.getByRole('button');
            expect(btnElement).toBeInTheDocument();
        });

        test('executes onClick callback', () => {
            let clicked = false;
            render(<ButtonComponent onClick={() => (clicked = true)}>Test</ButtonComponent>);
            screen.getByRole('button').click();
            expect(clicked).toBe(true);
        });

        test('can be disabled', () => {
            render(<ButtonComponent disabled>Test</ButtonComponent>);
            const btnElement = screen.getByRole('button');
            expect(btnElement).toBeDisabled();
        });

        test('does not execute onClick callback if disabled', () => {
            let clicked = false;
            render(
                <ButtonComponent disabled onClick={() => (clicked = true)}>
                    Test
                </ButtonComponent>
            );
            screen.getByRole('button').click();
            expect(clicked).toBe(false);
        });

        test('can take a custom className', () => {
            render(<ButtonComponent className="test">Test</ButtonComponent>);
            const btnElement = screen.getByRole('button');
            expect(btnElement).toHaveClass('test');
        });

        test('custom class name does not override default class name', () => {
            render(<ButtonComponent className="test">Test</ButtonComponent>);
            const btnElement = screen.getByRole('button');
            expect(btnElement).toHaveClass('rounded-full');
        });

        test('can take other button props', () => {
            render(<ButtonComponent type="submit">Test</ButtonComponent>);
            const btnElement = screen.getByRole('button');
            expect(btnElement).toHaveAttribute('type', 'submit');
        });
    });
}
