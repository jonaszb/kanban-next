import { useDroppable } from '@dnd-kit/core';
import { FC, PropsWithChildren } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';

const Droppable: FC<PropsWithChildren<{ id: UniqueIdentifier; className?: string }>> = (props) => {
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
