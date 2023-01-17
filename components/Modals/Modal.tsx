import { FC, MouseEventHandler, PropsWithChildren } from 'react';

type ModalProps = {
    onBackgroundClick?: MouseEventHandler;
    className?: string;
    type?: 'mobileMenu';
};

const Modal: FC<PropsWithChildren<ModalProps>> = (props) => {
    const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!props.onBackgroundClick) return;
        event.currentTarget !== event.target ? null : props.onBackgroundClick(event);
    };
    return (
        <div
            data-testid="modal-backdrop"
            onClick={onClickHandler}
            className={`absolute h-full w-full bg-black bg-opacity-50 ${
                props.type === 'mobileMenu' ? '' : 'flex items-center'
            }`}
        >
            <dialog
                className={`flex flex-col rounded-lg bg-white px-0 py-4 dark:bg-dark-grey ${
                    props.type === 'mobileMenu'
                        ? ' my-4 w-72 shadow-menu dark:shadow-menu-dark'
                        : 'w-86 p-6 sm:w-120 sm:p-8'
                } ${props.className || ''}`}
            >
                {props.children}
            </dialog>
        </div>
    );
};
export default Modal;
