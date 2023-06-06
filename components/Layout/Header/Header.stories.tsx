import Header from './Header';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BoardListContextProvider from '../../../store/BoardListContext';
import { Board } from '../../../types';

export default {
    title: 'Components/Layout/Header',
    component: Header,
} as Meta<typeof Header>;

const boards: Board[] = [
    {
        name: 'Board Name',
        uuid: '1',
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        user_uuid: '1',
        columns: [],
    },
];

const ctxValue = {
    boards: boards,
    selectedBoard: boards[0],
    selectedTask: null,
    setSelectedTask: () => null,
    isLoading: false,
    isValidating: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

export const HeaderDark: StoryObj<typeof Header> = {
    render: () => (
        <BoardListContextProvider value={ctxValue}>
            <Header />
        </BoardListContextProvider>
    ),
    parameters: {
        theme: 'dark',
    },
};

export const HeaderLight: StoryObj<typeof Header> = {
    render: () => (
        <BoardListContextProvider value={ctxValue}>
            <Header />
        </BoardListContextProvider>
    ),
    parameters: {
        theme: 'light',
        backgrounds: { default: 'light' },
    },
};
