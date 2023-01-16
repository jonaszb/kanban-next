import Header from './Header';
import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'Layout/Header',
    component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const HeaderDark = Template.bind({});
HeaderDark.args = { selectedBoard: 'Board Name' };
HeaderDark.parameters = { theme: 'dark' };

export const HeaderLight = Template.bind({});
HeaderLight.args = { selectedBoard: 'Board Name' };
