import { Decorator } from '@storybook/react';
import React from 'react';
import '../styles/globals.css';
import ThemeContextProvider from '../store/ThemeContext';
import { ThemeContext } from '../store/ThemeContext';

export const ThemeCtxProvider: Decorator = (StoryFn, context) => {
    return (
        <ThemeContextProvider>
            <StoryFn />
        </ThemeContextProvider>
    );
};

export const withTheme: Decorator = (StoryFn, context) => {
    return ThemeCtxProvider(() => {
        const themeCtx = React.useContext(ThemeContext);
        const theme = context.parameters.theme ? context.parameters.theme : themeCtx.darkModeEnabled ? 'dark' : 'light';
        return (
            <div className={theme}>
                <StoryFn />
            </div>
        );
    }, context);
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
