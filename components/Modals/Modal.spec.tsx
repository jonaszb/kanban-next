import { fireEvent, render } from '../../utils/test-utils';
import Modal from './Modal';
import '@testing-library/jest-dom';
import React from 'react';

describe('Modal', () => {
    let closeModal: jest.Mock;
    beforeEach(() => {
        closeModal = jest.fn();
    });

    test('Renders modal', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} />);
        const modal = getByTestId('modal');
        expect(modal).toBeInTheDocument();
    });

    test('Renders modal backdrop', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} />);
        const modalBackdrop = getByTestId('modal-backdrop');
        expect(modalBackdrop).toBeInTheDocument();
    });

    test('Renders modal with children', () => {
        const { getByText } = render(
            <Modal closeModal={closeModal}>
                <p>Test</p>
            </Modal>
        );
        const modal = getByText('Test');
        expect(modal).toBeInTheDocument();
    });

    test('Renders modal with className', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} className="test" />);
        const modal = getByTestId('modal');
        expect(modal).toHaveClass('test');
    });

    test('closeModal is called when backdrop is clicked', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} />);
        const modalBackdrop = getByTestId('modal-backdrop');
        fireEvent.click(modalBackdrop);
        expect(closeModal).toHaveBeenCalled();
    });

    test('closeModal is called when escape key is pressed', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} />);
        const modal = getByTestId('modal');
        fireEvent.keyDown(modal, { key: 'Escape' });
        expect(closeModal).toHaveBeenCalled();
    });

    test('Renders the danger modal', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} options={{ type: 'danger' }} />);
        const modal = getByTestId('danger-modal');
        expect(modal).toBeInTheDocument();
    });

    test('Can set danger modal header', () => {
        const { getByTestId } = render(
            <Modal closeModal={closeModal} options={{ type: 'danger', dangerHeader: 'Test' }} />
        );
        const heading = getByTestId('danger-header');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test');
    });

    test('Can set danger modal body', () => {
        const { getByTestId } = render(
            <Modal closeModal={closeModal} options={{ type: 'danger', dangerMessage: 'Test' }} />
        );
        const message = getByTestId('danger-message');
        expect(message).toBeInTheDocument();
        expect(message).toHaveTextContent('Test');
    });

    test('Confirm button calls onConfirmDelete', () => {
        const onConfirmDelete = jest.fn();
        const { getByTestId } = render(<Modal closeModal={closeModal} options={{ type: 'danger', onConfirmDelete }} />);
        const confirmButton = getByTestId('danger-confirm');
        fireEvent.click(confirmButton);
        expect(onConfirmDelete).toHaveBeenCalled();
    });

    test('Cancel button calls closeModal', () => {
        const onConfirmDelete = jest.fn();
        const { getByTestId } = render(<Modal closeModal={closeModal} options={{ type: 'danger', onConfirmDelete }} />);
        const cancelButton = getByTestId('danger-cancel');
        fireEvent.click(cancelButton);
        expect(closeModal).toHaveBeenCalled();
    });

    test('Cancel button does not call onConfirmDelete', () => {
        const onConfirmDelete = jest.fn();
        const { getByTestId } = render(<Modal closeModal={closeModal} options={{ type: 'danger', onConfirmDelete }} />);
        const cancelButton = getByTestId('danger-cancel');
        fireEvent.click(cancelButton);
        expect(onConfirmDelete).not.toHaveBeenCalled();
    });

    test('Renders the mobile menu modal', () => {
        const { getByTestId } = render(<Modal closeModal={closeModal} options={{ type: 'mobileMenu' }} />);
        const modal = getByTestId('mobile-menu');
        expect(modal).toBeInTheDocument();
    });
});
