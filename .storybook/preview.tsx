import '../utils/testStyles.css';
import { DecoratorFn } from '@storybook/react';
import React from 'react';

export const withTheme: DecoratorFn = (StoryFn, context) => {
    const { theme } = context.parameters;

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <StoryFn />
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
