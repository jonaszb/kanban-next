import React, { PropsWithChildren, useEffect } from 'react';

// Check default color scheme preference OR apply one from local storage
const prefersDark = (() => {
    if (typeof window === 'undefined') return false; // Return false if running on server
    const localStoragePreference = localStorage.getItem('darkModeEnabled');
    return localStoragePreference
        ? localStoragePreference === 'true'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

export const ThemeContext = React.createContext<{
    darkModeEnabled: boolean;
    toggleTheme: () => void;
}>({
    darkModeEnabled: true,
    toggleTheme: () => {},
});

const ThemeContextProvider: React.FC<PropsWithChildren> = (props) => {
    const [darkModeEnabled, setDarkModeEnabled] = React.useState<boolean>(true);

    const toggleTheme = () => {
        setDarkModeEnabled((prevTheme) => !prevTheme);
        localStorage.setItem('darkModeEnabled', (!darkModeEnabled).toString());
    };

    useEffect(() => {
        setDarkModeEnabled(prefersDark);
    }, []);

    const contextValue = {
        darkModeEnabled,
        toggleTheme,
    };

    return <ThemeContext.Provider value={contextValue}>{props.children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
