import { PopoverLink, LinkContainer } from './Popover';
import type { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Components/Popover',
    component: PopoverLink,
} as Meta<typeof PopoverLink>;

export const PopoverMenuLight: StoryFn<typeof PopoverLink> = (args) => {
    return (
        <LinkContainer>
            <PopoverLink onClick={() => {}}>Edit Task</PopoverLink>
            <PopoverLink danger onClick={() => {}}>
                Delete Task
            </PopoverLink>
            <PopoverLink disabled onClick={() => {}}>
                Logout
            </PopoverLink>
        </LinkContainer>
    );
};
PopoverMenuLight.parameters = {
    theme: 'light',
    chromatic: { pauseAnimationAtEnd: true },
};

export const PopoverMenuDark = PopoverMenuLight.bind({});
PopoverMenuDark.parameters = {
    theme: 'dark',
    chromatic: { pauseAnimationAtEnd: true },
};
