import SidebarElem from './Sidebar';
import type { Meta, StoryFn } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

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

export const Sidebar: StoryFn<typeof SidebarElem> = (args, context) => {
    const [isHidden, setIsHidden] = useState(args.isHidden);
    const onHideSidebar = () => {
        setIsHidden(true);
    };

    return (
        <SidebarElem
            darkModeEnabled={context.theme === 'dark'}
            onHideSidebar={onHideSidebar}
            isHidden={isHidden}
            boards={args.boards}
            onChangeTheme={context.toggleTheme}
        />
    );
};
Sidebar.args = {
    boards: boards,
};

export const SidebarLong: StoryFn<typeof SidebarElem> = (args, context) => {
    return <div className="h-screen">{Sidebar(args, context)}</div>;
};

SidebarLong.args = {
    boards: boards,
};

export const SidebarEmpty: StoryFn<typeof SidebarElem> = (args, context) => {
    return <div className="h-screen">{Sidebar(args, context)}</div>;
};
SidebarEmpty.args = {
    boards: [],
};
