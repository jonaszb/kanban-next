import React, { Dispatch, FC, SetStateAction } from 'react';
import BoardList from '../Layout/Sidebar/BoardList';
import ThemeToggle from '../Layout/Sidebar/ThemeToggle';

const MobileMenu: FC<{
    setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
    const closeMenuHandler = () => {
        props.setMenuIsOpen(false);
    };

    return (
        <React.Fragment>
            <BoardList onBoardSelect={closeMenuHandler} />
            <ThemeToggle className="mt-4" />
        </React.Fragment>
    );
};

export default MobileMenu;
