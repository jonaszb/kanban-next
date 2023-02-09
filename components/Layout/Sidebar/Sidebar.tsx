import { FC, MouseEventHandler } from 'react';
import BoardList from '../../BoardList/BoardList';
import ThemeToggle from '../../BoardList/ThemeToggle';
import { HideSidebarIcon } from '../../Icons/Icons';

const HideSideBarButton: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <button
            id="hide-sidebar-btn"
            className={`group mr-5 flex items-center rounded-r-full font-bold text-mid-grey transition-all hover:bg-grey-highlight hover:text-primary dark:hover:bg-white ${
                className ?? ''
            }`}
            {...restProps}
        >
            <HideSidebarIcon className="mr-2.5 fill-mid-grey group-hover:fill-primary" />
            <span>Hide sidebar</span>
        </button>
    );
};

const Sidebar: FC<{
    onHideSidebar: MouseEventHandler;
    isHidden: boolean;
}> = (props) => {
    return (
        <>
            {props.isHidden || (
                <div
                    id="sidebar"
                    className="hidden h-full flex-col bg-white py-8 dark:bg-dark-grey sm:flex sm:w-64 lg:w-72"
                >
                    <BoardList />
                    <ThemeToggle />
                    <HideSideBarButton className="my-3.5 py-3.5 pl-3 lg:pl-6" onClick={props.onHideSidebar} />
                </div>
            )}{' '}
        </>
    );
};

export default Sidebar;
