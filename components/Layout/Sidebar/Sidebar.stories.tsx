import SidebarElem from './Sidebar';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { testBoards as boards } from '../../../utils/test-utils';
import BoardListContextProvider from '../../../store/BoardListContext';

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
    selectedTask: null,
    setSelectedTask: () => {},
    isLoading: false,
    isValidating: false,
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
