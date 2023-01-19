import { FC, useContext } from 'react';
import { ButtonPrimaryLarge } from '../../Buttons/Buttons';
import { VerticalEllipsisIcon, AddTaskIconMobile, Chevron } from '../../Icons/Icons';
import MobileMenu from '../../Modals/MobileMenu';
import { BoardListContext } from '../../../store/BoardListContext';
import useModal from '../../../hooks/useModal';

const Header: FC = () => {
    const { selectedBoard, boards } = useContext(BoardListContext);
    const mobileMenu = useModal({ type: 'mobileMenu' });
    const MenuModal = mobileMenu.Component;

    const selectedBoardName = boards.find((board) => board.uuid === selectedBoard)?.name;

    const handleOptionsClick = () => {
        mobileMenu.close();
    };

    const handleNewTaskClick = () => {
        mobileMenu.close();
    };

    return (
        <header className="flex items-center justify-between border-lines-light bg-white font-jakarta dark:border-lines-dark dark:bg-dark-grey dark:text-white sm:border-l">
            <div className="relative flex">
                <h1 id="board-header" className="text-lg sm:ml-6 sm:text-xl sm:font-bold lg:text-2xl">
                    {selectedBoardName}
                </h1>
                <button className="flex w-6 items-center justify-center sm:hidden" onClick={mobileMenu.toggle}>
                    <Chevron className={`transition-all ${mobileMenu.isOpen ? 'rotate-180' : ''}`} />
                </button>
                <MenuModal>
                    <MobileMenu setMenuIsOpen={mobileMenu.close} />
                </MenuModal>
            </div>
            <div className="flex items-center">
                <ButtonPrimaryLarge
                    onClick={handleNewTaskClick}
                    id="new-task"
                    className="mr-2 !px-5 py-3 sm:mr-4 sm:py-4"
                    disabled={!selectedBoard}
                >
                    <span className="hidden sm:block">+ Add New Task</span>
                    <AddTaskIconMobile className="sm:hidden" />
                </ButtonPrimaryLarge>
                <button
                    aria-label="Board options"
                    id="board-options"
                    className="mr-2 inline-flex w-6 justify-center"
                    disabled={!selectedBoard}
                >
                    <VerticalEllipsisIcon onClick={handleOptionsClick} />
                </button>
            </div>
        </header>
    );
};

export default Header;
