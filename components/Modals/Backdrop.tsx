import { FC, MouseEventHandler, PropsWithChildren } from 'react';

const Backdrop: FC<PropsWithChildren<{ onClick?: MouseEventHandler }>> = (props) => {
    const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!props.onClick) return;
        event.currentTarget !== event.target ? null : props.onClick(event);
    };
    return (
        <div
            onClick={onClickHandler}
            className="absolute h-full w-full bg-black bg-opacity-50 shadow-lg shadow-blue-500/50"
        >
            {props.children}
        </div>
    );
};
export default Backdrop;
