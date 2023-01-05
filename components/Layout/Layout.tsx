import { FC, MouseEventHandler, PropsWithChildren, useEffect, useState } from 'react';
import { ShowSidebarIcon } from '../Icons/Icons';
import Header from './Header/Header';
import Logo from './Header/Logo';
import Sidebar from './Sidebar/Sidebar';

// Check default color scheme preference OR apply one from local storage
const prefersDark = (() => {
    if (typeof window === 'undefined') return false; // Return false if running on server
    const localStoragePreference = localStorage.getItem('darkModeEnabled');
    return localStoragePreference
        ? localStoragePreference === 'true'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

const ShowSidebarButton: FC<{ onShowSidebar: MouseEventHandler }> = ({ onShowSidebar }) => {
    return (
        <button
            id="show-sidebar-btn"
            onClick={onShowSidebar}
            className={`fixed bottom-8 hidden h-12 w-14 items-center justify-center rounded-r-full bg-primary hover:bg-primary-light sm:flex`}
        >
            <ShowSidebarIcon />
        </button>
    );
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
    // Set consistent initial state to avoid hydration mismatch. Actual value will be set in useEffect
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [sidebarHidden, setSidebarHidden] = useState(false);
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);

    const onChangeTheme = () => {
        setDarkModeEnabled(!darkModeEnabled);
        localStorage.setItem('darkModeEnabled', (!darkModeEnabled).toString());
    };

    const hideSidebarHandler = () => {
        setSidebarHidden(true);
    };

    const showSidebarHandler = () => {
        setSidebarHidden(false);
    };

    useEffect(() => {
        setDarkModeEnabled(prefersDark);
        fetch('/api/boards')
            .then((res) => res.json())
            .then((data) => setBoards(data));
    }, []);

    return (
        <div
            className={`app-container grid max-h-screen grid-cols-[max-content_1fr] grid-rows-[max-content_1fr] ${
                darkModeEnabled ? 'dark' : ''
            }`}
        >
            <Logo />
            <Header />
            <Sidebar
                darkModeEnabled={darkModeEnabled}
                onChangeTheme={onChangeTheme}
                onHideSidebar={hideSidebarHandler}
                isHidden={sidebarHidden}
                boards={boards}
            />
            <section
                className={`relative col-start-1 col-end-3 overflow-scroll border-t border-lines-light bg-light-grey dark:border-lines-dark dark:bg-v-dark-grey  ${
                    sidebarHidden ? '' : 'sm:col-start-2 sm:border-l'
                }`}
            >
                {sidebarHidden && <ShowSidebarButton onShowSidebar={showSidebarHandler} />} {children}
            </section>
            <div></div>
        </div>
    );
};

export default Layout;
