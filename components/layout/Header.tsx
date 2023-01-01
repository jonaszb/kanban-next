import Image from 'next/image';
import { ButtonPrimaryLarge } from '../Buttons/Buttons';
import EllipsisIcon from './icon-vertical-ellipsis.svg';
import PlusIcon from './icon-add-task-mobile.svg';

const Header = () => {
    return (
        <header className="flex items-center justify-between border-lines-light bg-white font-jakarta dark:border-lines-dark dark:bg-dark-grey dark:text-white sm:border-l">
            <h1 className="text-lg sm:ml-6 sm:text-xl sm:font-bold lg:text-2xl">Platform Launch</h1>
            <div className="flex items-center">
                <ButtonPrimaryLarge name="new-task" className="mr-2 !px-5 py-3 sm:mr-4 sm:py-4">
                    <span className="hidden sm:block">+ Add New Task</span>
                    <Image src={PlusIcon} alt="Plus icon" className="sm:hidden" />
                </ButtonPrimaryLarge>
                <button className="mr-2 inline-flex w-6 justify-center">
                    <Image src={EllipsisIcon} alt="Ellipsis icon" />
                </button>
            </div>
        </header>
    );
};

export default Header;
