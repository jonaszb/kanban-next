import { FC } from 'react';
import BoardList from './BoardList';
import ThemeToggle from './ThemeToggle';

const Sidebar: FC<{ darkModeEnabled: boolean; onChangeTheme: Function }> = (props) => {
    return (
        <div className="hidden h-full flex-col bg-white py-8 dark:bg-dark-grey sm:flex sm:w-64 lg:w-72">
            <BoardList />
            <ThemeToggle darkModeEnabled={props.darkModeEnabled} changeThemeHandler={props.onChangeTheme} />
        </div>
    );
};

export default Sidebar;
