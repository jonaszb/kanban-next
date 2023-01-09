import { FC } from 'react';

const ColumnHeader: FC<{ name: string; color: string; taskCount: number }> = (props) => {
    return (
        <div className="mb-6 flex">
            <div
                data-testId="column-color"
                className={`mr-3 h-4 w-4 rounded-full`}
                style={{ backgroundColor: props.color }}
            />
            <h3 className="text-xs font-bold uppercase tracking-[.2rem] dark:text-mid-grey">
                {props.name} {`(${props.taskCount})`}
            </h3>
        </div>
    );
};

export default ColumnHeader;
