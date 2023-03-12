import { FC, MouseEventHandler, PropsWithChildren, useEffect } from 'react';
import { ButtonDanger, ButtonSecondary } from '../Buttons/Buttons';

type ModalProps = {
    closeModal: () => void;
    className?: string;
    options?: {
        type?: 'mobileMenu' | 'danger';
        dangerHeader?: string;
        dangerMessage?: string;
        onConfirmDelete?: MouseEventHandler<HTMLButtonElement>;
    };
};

const ModalBase = (
    props: PropsWithChildren<ModalProps> & { onClickHandler: (event: React.MouseEvent<HTMLDivElement>) => void }
) => {
    const testId = props.options?.type
        ? { mobileMenu: 'mobile-menu', danger: 'danger-modal' }[props.options.type]
        : 'modal';
    return (
        <div
            data-testid="modal-backdrop"
            onClick={props.onClickHandler}
            className={`absolute z-50 bg-black bg-opacity-50 ${
                props.options?.type === 'mobileMenu' ? ' h-full w-full' : 'flex h-screen w-screen items-center'
            }`}
        >
            <dialog
                data-testid={testId}
                className={`z-50 block max-h-[80vh] overflow-auto bg-white dark:bg-dark-grey ${
                    props.options?.type === 'mobileMenu'
                        ? 'my-4 w-72 rounded-lg px-0 py-4 shadow-menu dark:shadow-menu-dark'
                        : 'w-86 rounded-md p-6 sm:w-120 sm:p-8'
                } ${props.className || ''}`}
            >
                {props.children}
            </dialog>
        </div>
    );
};

const Modal: FC<PropsWithChildren<ModalProps>> = (props) => {
    const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget !== event.target ? null : props.closeModal();
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.closeModal();
            }
        };
        document.addEventListener('keydown', handleEscape, false);
        return () => {
            document.removeEventListener('keydown', handleEscape, false);
        };
    });

    const DangerModal = (props: PropsWithChildren<ModalProps>) => {
        return (
            <ModalBase {...props} onClickHandler={onClickHandler}>
                <h2 data-testid="danger-header" className="mb-6 text-lg font-bold text-danger">
                    {props.options?.dangerHeader}
                </h2>
                <p data-testid="danger-message" className="mb-6 text-sm text-mid-grey">
                    {props.options?.dangerMessage}
                </p>
                {props.options?.onConfirmDelete && (
                    <div className="flex justify-end gap-4">
                        <ButtonDanger data-testid="danger-confirm" onClick={props.options?.onConfirmDelete}>
                            Delete
                        </ButtonDanger>
                        <ButtonSecondary data-testid="danger-cancel" onClick={props.closeModal}>
                            Cancel
                        </ButtonSecondary>
                    </div>
                )}
            </ModalBase>
        );
    };
    if (props.options?.type === 'danger') {
        return <DangerModal {...props}></DangerModal>;
    }
    return <ModalBase {...props} onClickHandler={onClickHandler}></ModalBase>;
};
export default Modal;
