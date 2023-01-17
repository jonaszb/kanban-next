import { Decorator } from '@storybook/react';
import React, { useState } from 'react';
import '../styles/globals.css';

export const withTheme: Decorator = (StoryFn, context) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(context.parameters.theme || 'light');
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <StoryFn theme={theme} toggleTheme={toggleTheme} />
        </div>
    );
};

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

export const decorators = [withTheme];
