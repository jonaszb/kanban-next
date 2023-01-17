import Header from './Header';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Layout/Header',
    component: Header,
} as Meta<typeof Header>;

export const HeaderDark: StoryObj<typeof Header> = {
    render: (args) => <Header {...args} />,
    args: { selectedBoard: 'Board Name' },
    parameters: { theme: 'dark' },
};

export const HeaderLight: StoryObj<typeof Header> = {
    render: (args) => <Header {...args} />,
    args: { selectedBoard: 'Board Name' },
};
