import Header from './Header';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BoardListContextProvider from '../../../store/BoardListContext';

export default {
    title: 'Components/Layout/Header',
    component: Header,
} as Meta<typeof Header>;

const boards = [
    {
        name: 'Board Name',
        uuid: '1',
    },
];

const ctxValue = {
    boards: boards,
    selectedBoard: boards[0].uuid,
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
    },
};
