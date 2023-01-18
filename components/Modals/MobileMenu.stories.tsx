import MobileMenuElem from './MobileMenu';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';

const boards = [
    {
        name: 'Platform Launch',
        uuid: uuidv4(),
    },
    {
        name: 'Marketing Plan',
        uuid: uuidv4(),
    },
    {
        name: 'Roadmap',
        uuid: uuidv4(),
    },
];

export default {
    title: 'Components/Modals',
    component: MobileMenuElem,
} as Meta<typeof MobileMenuElem>;

export const MobileMenu: StoryFn<typeof MobileMenuElem> = (args, context) => {
    return <MobileMenuElem setMenuIsOpen={() => {}} boards={args.boards} />;
};
MobileMenu.args = {
    boards: boards,
};
MobileMenu.parameters = {
    nextjs: {
        router: {
            query: { boardId: boards[1].uuid },
        },
    },
};

export const MobileMenuEmpty: StoryFn<typeof MobileMenuElem> = (args, context) => {
    return MobileMenu(args, context);
};
MobileMenuEmpty.args = {
    boards: [],
};
