import MobileMenuElem from './MobileMenu';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import BoardListContextProvider from '../../store/BoardListContext';
import { Board } from '../../types';

const sharedProps = {
    created_at: new Date(),
    updated_at: new Date(),
    user_uuid: uuidv4(),
    columns: [],
};
const boards: Board[] = [
    {
        name: 'Platform Launch',
        uuid: uuidv4(),
        id: 1,
        ...sharedProps,
    },
    {
        name: 'Marketing Plan',
        uuid: uuidv4(),
        id: 2,
        ...sharedProps,
    },
    {
        name: 'Roadmap',
        uuid: uuidv4(),
        id: 3,
        ...sharedProps,
    },
];

export default {
    title: 'Components/Modals',
    component: MobileMenuElem,
} as Meta<typeof MobileMenuElem>;

const ctxValue = {
    boards: boards,
    selectedBoard: null,
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};
export const MobileMenu: StoryFn<typeof MobileMenuElem> = (args) => {
    return (
        <BoardListContextProvider value={ctxValue}>
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
        <BoardListContextProvider value={{ ...ctxValue, boards: [] }}>
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
