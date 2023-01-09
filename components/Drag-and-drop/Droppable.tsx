import { useDroppable } from '@dnd-kit/core';
import { FC, PropsWithChildren } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';

const Droppable: FC<PropsWithChildren<{ droppableId: UniqueIdentifier } & React.ComponentProps<'div'>>> = (props) => {
    const { droppableId, ...restProps } = props;

    const { setNodeRef } = useDroppable({
        id: droppableId,
    });

    return (
        <div ref={setNodeRef} {...restProps}>
            {props.children}
        </div>
    );
};

export default Droppable;
