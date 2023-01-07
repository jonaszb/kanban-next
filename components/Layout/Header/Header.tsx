import { FC, useEffect, useState } from 'react';
import { ButtonPrimaryLarge } from '../../Buttons/Buttons';
import ReactDOM from 'react-dom';
import { VerticalEllipsisIcon, AddTaskIconMobile, Chevron } from '../../Icons/Icons';
import { Board } from '../../../types';
import MobileMenu from '../../Modals/MobileMenu';

const Header: FC<{ selectedBoard?: string; darkModeEnabled: boolean; onChangeTheme: Function; boards: Board[] }> = (
    props
) => {
    const { selectedBoard, ...mobileMenuProps } = props;
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [mobileMenuRoot, setMobileMenuRoot] = useState<HTMLElement | null>(null);

    const toggleMenu = () => {
        setMenuIsOpen(!menuIsOpen);
    };

    useEffect(() => {
        setMobileMenuRoot(document.getElementById('mobile-menu-root'));
    }, []);
    return (
        <header className="flex items-center justify-between border-lines-light bg-white font-jakarta dark:border-lines-dark dark:bg-dark-grey dark:text-white sm:border-l">
            <div className="relative flex">
                <h1 id="board-header" className="text-lg sm:ml-6 sm:text-xl sm:font-bold lg:text-2xl">
                    {selectedBoard}
                </h1>
                <button className="flex w-6 items-center justify-center sm:hidden" onClick={toggleMenu}>
                    <Chevron className={`transition-all ${menuIsOpen ? 'rotate-180' : ''}`} />
                </button>
                {menuIsOpen &&
                    mobileMenuRoot &&
                    ReactDOM.createPortal(
                        <MobileMenu setMenuIsOpen={setMenuIsOpen} {...mobileMenuProps} />,
                        mobileMenuRoot
                    )}
            </div>
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
