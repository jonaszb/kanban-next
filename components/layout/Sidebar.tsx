import { ChangeEventHandler, FC, PropsWithChildren } from 'react';
import BoardList from './BoardList';

const Sidebar: FC<{ darkModeEnabled: boolean; onChangeTheme: ChangeEventHandler }> = (props) => {
    return (
        <div className="hidden h-full flex-col bg-white py-8 dark:bg-dark-grey sm:flex sm:w-64 lg:w-72">
            <BoardList />
            <input type="checkbox" checked={props.darkModeEnabled} onChange={props.onChangeTheme} />
        </div>
    );
};

export default Sidebar;
