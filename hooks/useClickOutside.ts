import { useEffect } from 'react';

type ClickEvent = MouseEvent | TouchEvent;
type ClickOutsideHook = (ref: React.RefObject<HTMLElement | null>, handler: (e: ClickEvent) => void) => void;

const useClickOutside: ClickOutsideHook = (ref, handler) => {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        const listener = (event: ClickEvent) => {
            if (startedInside || !startedWhenMounted) return;
            if (!ref.current || ref.current.contains(event.target as Node)) return;

            handler(event);
        };

        const validateEventStart = (event: ClickEvent) => {
            startedWhenMounted = !!ref.current;
            startedInside = !!ref.current && ref.current.contains(event.target as Node);
        };

        document.addEventListener('mousedown', validateEventStart);
        document.addEventListener('touchstart', validateEventStart);
        document.addEventListener('mouseup', listener);
        document.addEventListener('touchend', listener);

        return () => {
            document.removeEventListener('mousedown', validateEventStart);
            document.removeEventListener('touchstart', validateEventStart);
            document.removeEventListener('mouseup', listener);
            document.removeEventListener('touchend', listener);
        };
    }, [ref, handler]);
};

export default useClickOutside;
