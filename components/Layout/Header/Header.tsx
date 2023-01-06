import { FC } from 'react';
import { ButtonPrimaryLarge } from '../../Buttons/Buttons';
import { VerticalEllipsisIcon, AddTaskIconMobile } from '../../Icons/Icons';

const Header: FC<{ selectedBoard?: string }> = ({ selectedBoard }) => {
    return (
        <header className="flex items-center justify-between border-lines-light bg-white font-jakarta dark:border-lines-dark dark:bg-dark-grey dark:text-white sm:border-l">
            <h1 id="board-header" className="text-lg sm:ml-6 sm:text-xl sm:font-bold lg:text-2xl">
                {selectedBoard}
            </h1>
            <div className="flex items-center">
                <ButtonPrimaryLarge id="new-task" className="mr-2 !px-5 py-3 sm:mr-4 sm:py-4">
                    <span className="hidden sm:block">+ Add New Task</span>
                    <AddTaskIconMobile className="sm:hidden" />
                </ButtonPrimaryLarge>
                <button aria-label="Board options" id="board-options" className="mr-2 inline-flex w-6 justify-center">
                    <VerticalEllipsisIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;