import { useState, useEffect, FC, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import ModalElem from '../components/Modals/Modal';

type ModalHook = {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    Component: FC<PropsWithChildren>;
};

const useModal = (options?: { type?: 'mobileMenu' }): ModalHook => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [mobileMenuRoot, setMobileMenuRoot] = useState<HTMLElement | null>(null);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const close = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        setMobileMenuRoot(document.getElementById('mobile-menu-root'));
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    const Component = (props: PropsWithChildren<{}>) => {
        return isOpen && modalRoot && mobileMenuRoot
            ? ReactDOM.createPortal(
                  <ModalElem closeModal={toggle} type={options?.type}>
                      {props.children}
                  </ModalElem>,
                  options?.type === 'mobileMenu' ? mobileMenuRoot : modalRoot
              )
            : null;
    };

    return {
        isOpen,
        toggle,
        close,
        Component,
    };
};

export default useModal;
