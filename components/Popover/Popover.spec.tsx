import { render, screen } from '../../utils/test-utils';
import { LinkContainer, PopoverLink } from './Popover';
import '@testing-library/jest-dom';
import React from 'react';

describe('Popover', () => {
    test('can be rendered without links', () => {
        render(<LinkContainer />);
        const popover = screen.getByTestId('popover-menu');
        expect(popover).toBeInTheDocument();
    });

    test('can be rendered with links', () => {
        render(
            <LinkContainer>
                <PopoverLink onClick={() => {}}>Test</PopoverLink>
            </LinkContainer>
        );
        const popover = screen.getByTestId('popover-menu');
        const link = screen.getByTestId('popover-item');
        expect(popover).toBeInTheDocument();
        expect(link).toBeInTheDocument();
    });

    test('should render the popover link', () => {
        render(<PopoverLink onClick={() => {}}>Test</PopoverLink>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeInTheDocument();
    });

    test('should execute onClick callback', () => {
        const mockFn = jest.fn();
        render(<PopoverLink onClick={mockFn}>Test</PopoverLink>);
        screen.getByRole('button').click();
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('can be disabled', () => {
        render(
            <PopoverLink onClick={() => {}} disabled>
                Test
            </PopoverLink>
        );
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeDisabled();
    });

    test('does not execute onClick callback if disabled', () => {
        const mockFn = jest.fn();
        render(
            <PopoverLink onClick={mockFn} disabled>
                Test
            </PopoverLink>
        );
        screen.getByRole('button').click();
        expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test('link container can take a custom className', () => {
        render(<LinkContainer className="test" />);
        const popover = screen.getByTestId('popover-menu');
        expect(popover).toHaveClass('test');
    });

    test('link can take a custom className', () => {
        render(
            <PopoverLink onClick={() => {}} className="test">
                Test
            </PopoverLink>
        );
        const link = screen.getByTestId('popover-item');
        expect(link).toHaveClass('test');
    });

    test('link container custom class name does not override default class name', () => {
        render(<LinkContainer className="test" />);
        const popover = screen.getByTestId('popover-menu');
        expect(popover).toHaveClass('bg-white');
    });

    test('link is not disabled by default', () => {
        render(<PopoverLink onClick={() => {}}>Test</PopoverLink>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).not.toBeDisabled();
    });

    test('Link is not "danger" by default', () => {
        render(<PopoverLink onClick={() => {}}>Test</PopoverLink>);
        const btnElement = screen.getByRole('button');
        expect(btnElement).not.toHaveClass('text-danger');
    });

    test('link type can be danger', () => {
        render(
            <PopoverLink onClick={() => {}} danger>
                Test
            </PopoverLink>
        );
        const btnElement = screen.getByRole('button');
        expect(btnElement).toHaveClass('text-danger');
    });

    test('link type can be danger and custom class name', () => {
        render(
            <PopoverLink onClick={() => {}} danger className="test">
                Test
            </PopoverLink>
        );
        const btnElement = screen.getByRole('button');
        const link = screen.getByTestId('popover-item');
        expect(btnElement).toHaveClass('text-danger');
        expect(link).toHaveClass('test');
    });

    test('danger link can be disabled', () => {
        render(
            <PopoverLink onClick={() => {}} danger disabled>
                Test
            </PopoverLink>
        );
        const btnElement = screen.getByRole('button');
        expect(btnElement).toBeDisabled();
    });

    test('can have an id', () => {
        render(<PopoverLink onClick={() => {}} id="test" />);
        const btnElement = screen.getByRole('button');
        expect(btnElement).toHaveAttribute('id', 'test');
    });
});
