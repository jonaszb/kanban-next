import { Button, ButtonPrimaryLarge } from './Buttons';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const BtnPrimaryLargeTemplate: ComponentStory<typeof ButtonPrimaryLarge> = (args) => (
    <ButtonPrimaryLarge {...args}>Button</ButtonPrimaryLarge>
);

export const PrimaryLarge = BtnPrimaryLargeTemplate.bind({});
