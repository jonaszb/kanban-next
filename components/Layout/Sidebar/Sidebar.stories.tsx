import SidebarElem from './Sidebar';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
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
        <BoardListContextProvider value={{ boards: [], selectedBoard: null }}>
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
