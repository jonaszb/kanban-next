import { FC, useContext } from 'react';
import { ThemeContext } from '../../store/ThemeContext';
import { LightThemeIcon, DarkThemeIcon } from '../Icons/Icons';

const ThemeToggle: FC<{ className?: string }> = (props) => {
    const { darkModeEnabled, toggleTheme } = useContext(ThemeContext);

    return (
        <div
            id="theme-toggle"
            className={`mx-3 flex items-center justify-center rounded bg-light-grey py-3.5 dark:bg-v-dark-grey ${
                props.className ?? ''
            }`}
        >
            <LightThemeIcon />
            <div className="group mx-5 h-6 w-12 items-center">
                <input
                    id="themeSwitch"
                    type="checkbox"
                    className="hidden"
                    checked={darkModeEnabled}
                    onChange={toggleTheme}
                />
                <label
                    className={`flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-primary transition-all group-hover:bg-primary-light  `}
                    htmlFor="themeSwitch"
                    role="switch"
                    aria-checked={darkModeEnabled}
                    aria-label="Toggle dark mode"
                >
                    <span
                        className={`aspect-square w-4 cursor-pointer  rounded-full bg-white transition-all duration-300 ease-in-out ${
                            darkModeEnabled ? 'translate-x-3/4' : '-translate-x-3/4'
                        }`}
                    ></span>
                </label>
            </div>
            <DarkThemeIcon />
        </div>
    );
};

export default ThemeToggle;
