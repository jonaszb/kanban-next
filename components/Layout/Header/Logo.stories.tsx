import Logo from './Logo';
import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'Layout/Header',
    component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = () => <Logo />;

export const LogoDark = Template.bind({});
LogoDark.parameters = { theme: 'dark' };

export const LogoLight = Template.bind({});
