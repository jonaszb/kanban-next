import { useEffect } from 'react';

type ClickEvent = MouseEvent | TouchEvent | KeyboardEvent;
type ClickOutsideHook = (ref: React.RefObject<HTMLElement>, handler: (e: ClickEvent) => void) => void;

const useClickOutside: ClickOutsideHook = (ref, handler) => {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        const listener = (event: ClickEvent) => {
            if (startedInside || !startedWhenMounted) return;
            if (!ref.current || ref.current.contains(event.target as Node)) return;

            handler(event);
        };

        const validateEventStart = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
            startedWhenMounted = !!ref.current;
            startedInside = !!ref.current && ref.current.contains(event.target as Node);
        };

        document.addEventListener('mousedown', validateEventStart);
        document.addEventListener('touchstart', validateEventStart);
        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('mousedown', validateEventStart);
            document.removeEventListener('touchstart', validateEventStart);
            document.removeEventListener('click', listener);
        };
    }, [ref, handler]);
};

export default useClickOutside;
