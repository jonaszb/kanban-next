import BoardList from './BoardList';
import type { Meta, StoryObj } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import BoardListContextProvider from '../../../store/BoardListContext';
import { Board } from '../../../types';

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
