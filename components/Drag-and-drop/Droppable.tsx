import { useDroppable } from '@dnd-kit/core';
import { FC, PropsWithChildren } from 'react';

const Droppable: FC<PropsWithChildren<{ id: string; className?: string }>> = (props) => {
    const { setNodeRef } = useDroppable({
        id: props.id,
    });

    return (
        <div ref={setNodeRef} className={props.className}>
            {props.children}
        </div>
    );
};

export default Droppable;
