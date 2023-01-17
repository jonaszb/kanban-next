import { FC, useState } from 'react';
import { LightThemeIcon, DarkThemeIcon } from '../../Icons/Icons';

const ThemeToggle: FC<{ darkModeEnabled: boolean; changeThemeHandler: Function; className?: string }> = (props) => {
    const handleToggle = () => {
        props.changeThemeHandler();
    };

    return (
        <div
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
                    checked={props.darkModeEnabled}
                    onChange={handleToggle}
                />
                <label
                    className={`flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-primary transition-all group-hover:bg-primary-light  `}
                    htmlFor="themeSwitch"
                    role="switch"
                >
                    <span
                        className={`aspect-square w-4 cursor-pointer  rounded-full bg-white transition-all duration-300 ease-in-out ${
                            props.darkModeEnabled ? 'translate-x-3/4' : '-translate-x-3/4'
                        }`}
                    ></span>
                </label>
            </div>
            <DarkThemeIcon />
        </div>
    );
};

export default ThemeToggle;
