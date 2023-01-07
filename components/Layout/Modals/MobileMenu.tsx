import { Dispatch, FC, SetStateAction } from 'react';
import { Board } from '../../../types';
import BoardList from '../Sidebar/BoardList';
import ThemeToggle from '../Sidebar/ThemeToggle';
import Backdrop from './Backdrop';

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
        <Backdrop onClick={closeMenuHandler}>
            <dialog className="mt-4 flex w-72 flex-col rounded-lg bg-white px-0 py-4 dark:bg-dark-grey">
                <BoardList boards={props.boards} onBoardSelect={closeMenuHandler} />
                <ThemeToggle
                    darkModeEnabled={props.darkModeEnabled}
                    changeThemeHandler={props.onChangeTheme}
                    className="mt-4"
                />
            </dialog>
        </Backdrop>
    );
};

export default MobileMenu;
