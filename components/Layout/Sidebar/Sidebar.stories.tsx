import SidebarElem from './Sidebar';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
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
    title: 'Components/Layout/Sidebar',
    component: SidebarElem,
} as Meta<typeof SidebarElem>;

const SidebarBase: StoryFn<typeof SidebarElem> = (args, context) => {
    const [isHidden, setIsHidden] = useState(args.isHidden);
    const onHideSidebar = () => {
        setIsHidden(true);
    };

    return <SidebarElem onHideSidebar={onHideSidebar} isHidden={isHidden} />;
};

const ctxValue = {
    boards: boards,
    selectedBoard: null,
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

export const Sidebar: StoryFn<typeof SidebarElem> = (args, context) => {
    return <BoardListContextProvider value={ctxValue}>{SidebarBase(args, context)}</BoardListContextProvider>;
};

export const SidebarLong: StoryFn<typeof SidebarElem> = (args, context) => {
    return (
        <BoardListContextProvider value={ctxValue}>
            <div className="h-screen">{SidebarBase(args, context)}</div>
        </BoardListContextProvider>
    );
};

export const SidebarEmpty: StoryFn<typeof SidebarElem> = (args, context) => {
    return (
        <BoardListContextProvider value={{ ...ctxValue, boards: [] }}>
            <div className="h-screen">{SidebarBase(args, context)}</div>
        </BoardListContextProvider>
    );
};

Sidebar.parameters =
    SidebarLong.parameters =
    SidebarEmpty.parameters =
        {
            nextjs: {
                router: {
                    query: { boardId: boards[1].uuid },
                },
            },
        };
