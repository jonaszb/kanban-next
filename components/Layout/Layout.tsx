import { FC, MouseEventHandler, PropsWithChildren, useState, useContext } from 'react';
import { ShowSidebarIcon } from '../Icons/Icons';
import Header from './Header/Header';
import Logo from './Header/Logo';
import Sidebar from './Sidebar/Sidebar';
import { ThemeContext } from '../../store/ThemeContext';

const ShowSidebarButton: FC<{ onShowSidebar: MouseEventHandler }> = ({ onShowSidebar }) => {
    return (
        <button
            id="show-sidebar-btn"
            onClick={onShowSidebar}
            className={`fixed bottom-8 z-10 hidden h-12 w-14 items-center justify-center rounded-r-full bg-primary transition-colors hover:bg-primary-light sm:flex`}
        >
            <ShowSidebarIcon />
        </button>
    );
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
    const [sidebarHidden, setSidebarHidden] = useState(false);

    const { darkModeEnabled } = useContext(ThemeContext);

    const hideSidebarHandler = () => {
        setSidebarHidden(true);
    };

    const showSidebarHandler = () => {
        setSidebarHidden(false);
    };

    return (
        <div
            className={`app-container relative grid h-screen grid-cols-[max-content_1fr] grid-rows-[max-content_1fr] ${
                darkModeEnabled ? 'dark' : ''
            }`}
        >
            <Logo />
            <Header />
            <Sidebar onHideSidebar={hideSidebarHandler} isHidden={sidebarHidden} />
            <section
                className={`relative col-start-1 col-end-3 overflow-scroll border-t border-lines-light bg-light-grey dark:border-lines-dark dark:bg-v-dark-grey  ${
                    sidebarHidden ? '' : 'sm:col-start-2 sm:border-l'
                }`}
            >
                <div id="mobile-menu-root" />
                {sidebarHidden && <ShowSidebarButton onShowSidebar={showSidebarHandler} />} {children}
            </section>
            <div id="modal-root" className="absolute" />
            <div id="popover-root" className="absolute" />
        </div>
    );
};

export default Layout;
