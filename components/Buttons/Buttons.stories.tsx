import { Button, ButtonDanger, ButtonPrimary, ButtonPrimaryLarge, ButtonSecondary } from './Buttons';
import type { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Components/Buttons',
    component: Button,
} as Meta<typeof Button>;

export const PrimaryLarge: StoryFn<typeof ButtonPrimaryLarge> = (args) => {
    return <ButtonPrimaryLarge {...args}>Button</ButtonPrimaryLarge>;
};

export const Primary: StoryFn<typeof ButtonPrimary> = (args) => {
    return <ButtonPrimary {...args}>Button</ButtonPrimary>;
};

export const Secondary: StoryFn<typeof ButtonSecondary> = (args) => {
    return <ButtonSecondary {...args}>Button</ButtonSecondary>;
};

export const Danger: StoryFn<typeof ButtonDanger> = (args) => {
    return <ButtonDanger {...args}>Button</ButtonDanger>;
};
