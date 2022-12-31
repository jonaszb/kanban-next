import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Header from './Header';
import Logo from './Logo';

// Check default color scheme preference OR apply one from local storage
const prefersDark = (() => {
    if (typeof window === 'undefined') return false; // Return false if running on server
    const localStoragePreference = localStorage.getItem('darkModeEnabled');
    return localStoragePreference
        ? localStoragePreference === 'true'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

const Layout: FC<PropsWithChildren> = ({ children }) => {
    // Set consistent initial state to avoid hydration mismatch. Actual value will be set in useEffect
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    useEffect(() => {
        setDarkModeEnabled(prefersDark);
    }, []);

    return (
        <div
            className={`app-container grid h-screen grid-cols-[max-content_1fr] grid-rows-[max-content_1fr] ${
                darkModeEnabled ? 'dark' : ''
            }`}
        >
            <Logo />
            <Header />
            <div className="hidden h-full bg-white dark:bg-dark-grey sm:block sm:w-64 lg:w-72">Sidebar placeholder</div>
            <section className="col-start-1 col-end-3 border-t border-lines-light bg-light-grey dark:border-lines-dark dark:bg-v-dark-grey sm:col-start-2 sm:border-l">
                {children}
            </section>
        </div>
    );
};

export default Layout;
