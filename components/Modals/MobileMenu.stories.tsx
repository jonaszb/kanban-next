import MobileMenuElem from './MobileMenu';
import type { Meta, StoryFn } from '@storybook/react';
import { testBoards as boards } from '../../utils/test-utils';
import BoardListContextProvider from '../../store/BoardListContext';

export default {
    title: 'Components/Modals',
    component: MobileMenuElem,
} as Meta<typeof MobileMenuElem>;

const ctxValue = {
    boards: boards,
    selectedBoard: null,
    selectedTask: null,
    setSelectedTask: () => null,
    isLoading: false,
    isValidating: false,
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
