import Logo from './Logo';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Layout/Header',
    component: Logo,
} as Meta<typeof Logo>;

export const LogoDark: StoryObj<typeof Logo> = {
    render: () => <Logo />,
    parameters: { theme: 'dark' },
};

export const LogoLight: StoryObj<typeof Logo> = {
    render: () => <Logo />,
    parameters: { theme: 'light', backgrounds: { default: 'light' } },
};
