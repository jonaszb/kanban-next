import { Button, ButtonPrimaryLarge } from './Buttons';
import type { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Buttons',
    component: Button,
} as Meta<typeof Button>;

export const PrimaryLarge: StoryObj<typeof ButtonPrimaryLarge> = {
    render: () => <ButtonPrimaryLarge>Button</ButtonPrimaryLarge>,
};
