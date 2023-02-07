import { FC, PropsWithChildren, SyntheticEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';

const LinkContainer: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    return (
        <ul className={`w-48 rounded-md bg-white p-4 shadow-md dark:bg-v-dark-grey ${className ?? ''}`}>{children}</ul>
    );
};

const PopoverLink: FC<
    PropsWithChildren<{ onClick: (e: SyntheticEvent) => void; danger?: boolean; disabled?: boolean; id?: string }>
> = ({ danger, onClick, disabled, id, children }) => {
    return (
        <li className="mb-4 last:mb-0">
            <button
                className={`cursor-pointer  ${
                    danger ? 'text-danger' : 'text-mid-grey'
                } disabled:cursor-default disabled:text-opacity-50`}
                onClick={onClick}
                disabled={disabled}
                id={id}
            >
                {children}
            </button>
        </li>
    );
};

type PopoverHook = {
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    open: (event: React.MouseEvent | React.KeyboardEvent) => void;
    close: () => void;
    toggle: (event: React.MouseEvent | React.KeyboardEvent) => void;
    Component: React.FC<React.PropsWithChildren<{ anchorWidth?: boolean; className?: string }>>;
    Link: typeof PopoverLink;
    LinkContainer: typeof LinkContainer;
};

const usePopover = (): PopoverHook => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [popoverRoot, setPopoverRoot] = useState<HTMLElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

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
        const pos = anchorEl?.getBoundingClientRect();
        const style = {
            top: pos?.top,
            left: pos?.left,
            width: props.anchorWidth ? pos?.width : undefined,
        };

        return isOpen && popoverRoot
            ? ReactDOM.createPortal(
                  <div ref={popoverRef} className={`absolute z-50 ${props.className}`} style={style}>
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

    return { anchorEl, isOpen, open, close, toggle, Component, Link: PopoverLink, LinkContainer };
};

export default usePopover;
