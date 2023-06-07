import BoardList from './BoardList';
import { testBoards as boards } from '../../utils/test-utils';
import type { Meta, StoryObj } from '@storybook/react';
import BoardListContextProvider from '../../store/BoardListContext';

export default {
    title: 'Components/Layout/BoardList',
    component: BoardList,
    argTypes: {},
} as Meta<typeof BoardList>;

const ctxValue = {
    boards: boards,
    selectedBoard: null,
    selectedTask: null,
    setSelectedTask: () => {},
    isLoading: false,
    isValidating: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

export const List: StoryObj<typeof BoardList> = {
    render: (args) => (
        <BoardListContextProvider value={ctxValue}>
            <BoardList {...args} />
        </BoardListContextProvider>
    ),
    parameters: {
        nextjs: {
            router: {
                query: { boardId: boards[1].uuid },
            },
        },
    },
};
