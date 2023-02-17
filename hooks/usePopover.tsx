import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import useClickOutside from './useClickOutside';

type PopoverHook = {
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    open: (event: React.MouseEvent | React.KeyboardEvent) => void;
    close: () => void;
    toggle: (event: React.MouseEvent | React.KeyboardEvent) => void;
    Component: React.FC<React.PropsWithChildren<{ anchorWidth?: boolean; className?: string }>>;
};

const usePopover = (): PopoverHook => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [popoverRoot, setPopoverRoot] = useState<HTMLElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useClickOutside(popoverRef, (e) => {
        if (e.target === anchorEl) return;
        setIsOpen(false);
    });

    const open = (event: React.MouseEvent | React.KeyboardEvent) => {
        setAnchorEl(event.currentTarget as HTMLElement);
        setIsOpen(true);
    };

    const close = () => {
        setAnchorEl(null);
        setIsOpen(false);
    };

    const toggle = (event: React.MouseEvent | React.KeyboardEvent) => {
        if (isOpen) {
            close();
        } else {
            open(event);
        }
    };

    const Component = (props: React.PropsWithChildren<{ anchorWidth?: boolean; className?: string }>) => {
        const handleResize = () => {
            if (isOpen) {
                const pos = anchorEl?.getBoundingClientRect();
                const style = {
                    top: pos?.top,
                    left: pos?.left,
                    width: props.anchorWidth ? pos?.width : undefined,
                };
                popoverRef.current?.setAttribute(
                    'style',
                    `top: ${style.top}px; left: ${style.left}px; width: ${style.width}px`
                );
            }
        };

        useEffect(() => {
            if (popoverRef.current) handleResize();
        }, [popoverRef.current]);

        useEffect(() => {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [isOpen]);

        return isOpen && popoverRoot
            ? ReactDOM.createPortal(
                  <div ref={popoverRef} className={`absolute z-50 ${props.className}`}>
                      {props.children}
                  </div>,
                  popoverRoot
              )
            : null;
    };

    useEffect(() => {
        setPopoverRoot(document.getElementById('popover-root'));
    }, []);

    return { anchorEl, isOpen, open, close, toggle, Component };
};

export default usePopover;
