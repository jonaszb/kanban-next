import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';

type PopoverHook = {
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    open: (event: React.MouseEvent<HTMLElement>) => void;
    close: () => void;
    toggle: (event: React.MouseEvent<HTMLElement>) => void;
    Component: React.FC<React.PropsWithChildren<{ anchorWidth?: boolean }>>;
};

const usePopover = (): PopoverHook => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [popoverRoot, setPopoverRoot] = useState<HTMLElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const open = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
    };

    const close = () => {
        setAnchorEl(null);
        setIsOpen(false);
    };

    const toggle = (event: React.MouseEvent<HTMLElement>) => {
        if (isOpen) {
            close();
        } else {
            open(event);
        }
    };

    const Component = (props: React.PropsWithChildren<{ anchorWidth?: boolean }>) => {
        const pos = anchorEl?.getBoundingClientRect();
        const style = {
            top: pos?.top,
            left: pos?.left,
            width: props.anchorWidth ? pos?.width : undefined,
        };

        return isOpen && popoverRoot
            ? ReactDOM.createPortal(
                  <div ref={popoverRef} className={`absolute`} style={style}>
                      {props.children}
                  </div>,
                  popoverRoot
              )
            : null;
    };

    useEffect(() => {
        setPopoverRoot(document.getElementById('popover-root'));
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            console.log('clicked');
            if (
                isOpen &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                !((event.target as Node) === anchorEl)
            ) {
                close();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverRef, anchorEl]);

    return { anchorEl, isOpen, open, close, toggle, Component };
};

export default usePopover;
