import BoardList from './BoardList';
import type { Meta, StoryObj } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import BoardListContextProvider from '../../../store/BoardListContext';

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
    title: 'Components/Layout/BoardList',
    component: BoardList,
    argTypes: {},
} as Meta<typeof BoardList>;

export const List: StoryObj<typeof BoardList> = {
    render: (args) => (
        <BoardListContextProvider value={{ boards: boards, selectedBoard: null }}>
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
