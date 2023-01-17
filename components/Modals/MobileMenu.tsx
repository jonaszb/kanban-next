import { Dispatch, FC, SetStateAction } from 'react';
import { Board } from '../../types';
import BoardList from '../Layout/Sidebar/BoardList';
import ThemeToggle from '../Layout/Sidebar/ThemeToggle';
import Modal from './Modal';

const MobileMenu: FC<{
    darkModeEnabled: boolean;
    onChangeTheme: Function;
    boards: Board[];
    setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
    const closeMenuHandler = () => {
        props.setMenuIsOpen(false);
    };

    return (
        <Modal type="mobileMenu" onBackgroundClick={closeMenuHandler}>
            <BoardList boards={props.boards} onBoardSelect={closeMenuHandler} />
            <ThemeToggle
                darkModeEnabled={props.darkModeEnabled}
                changeThemeHandler={props.onChangeTheme}
                className="mt-4"
            />
        </Modal>
    );
};

export default MobileMenu;
