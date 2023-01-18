import MobileMenuElem from './MobileMenu';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import BoardListContextProvider from '../../store/BoardListContext';

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

type CtxProps = {
    boards: typeof boards;
    selectedBoard: string | null;
};
export const MobileMenu: StoryFn<typeof MobileMenuElem> = (args) => {
    return (
        <BoardListContextProvider value={{ boards: boards, selectedBoard: null }}>
            <MobileMenuElem setMenuIsOpen={() => {}} />
        </BoardListContextProvider>
    );
};
MobileMenu.parameters = {
    args: {
        boards: boards,
        selectedBoard: null,
    },
    nextjs: {
        router: {
            query: { boardId: boards[1].uuid },
        },
    },
};

export const MobileMenuEmpty: StoryFn<typeof MobileMenuElem> = (args, context) => {
    return (
        <BoardListContextProvider value={{ boards: [], selectedBoard: null }}>
            <MobileMenuElem setMenuIsOpen={() => {}} />
        </BoardListContextProvider>
    );
};

MobileMenuEmpty.parameters = {
    ...MobileMenu.parameters,
    args: {
        boards: [],
    },
};
