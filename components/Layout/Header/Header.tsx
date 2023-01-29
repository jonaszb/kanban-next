import React, { FC, SyntheticEvent, useContext } from 'react';
import { ButtonPrimaryLarge } from '../../Buttons/Buttons';
import { VerticalEllipsisIcon, AddTaskIconMobile, Chevron } from '../../Icons/Icons';
import MobileMenu from '../../Modals/MobileMenu';
import { BoardListContext, useBoardsContext } from '../../../store/BoardListContext';
import useModal from '../../../hooks/useModal';
import NewTaskForm from '../../Modals/NewTaskForm';
import usePopover from '../../../hooks/usePopover';
import { useRouter } from 'next/router';

const PopoverLink = ({
    children,
    onClick,
    danger,
    disabled,
    id,
}: {
    children: React.ReactNode;
    onClick: (e: SyntheticEvent) => void;
    danger?: boolean;
    disabled?: boolean;
    id?: string;
}) => {
    return (
        <li className="mb-4 last:mb-0">
            <button
                className={`cursor-pointer  ${
                    danger ? 'text-danger' : 'text-mid-grey'
                } disabled:cursor-default disabled:text-opacity-50`}
                onClick={onClick}
                disabled={disabled}
                id={id}
            >
                {children}
            </button>
        </li>
    );
};

const Header: FC = () => {
    // const { selectedBoard, boards } = useContext(BoardListContext);
    const mobileMenu = useModal({ type: 'mobileMenu' });
    const newTaskModal = useModal();
    const router = useRouter();
    const { boards, selectedBoard, mutateBoards } = useBoardsContext();

    const selectedBoardData = boards?.find((board) => board.uuid === selectedBoard);

    // Strings for the delete modal
    const modalTitle = 'Delete this board?';
    const modalMessage = `Are you sure you want to delete the ‘${selectedBoardData?.name}’ board? This action will remove all columns and tasks and cannot be reversed.`;

    const confirmDeleteHandler = async () => {
        await fetch(`/api/boards/${selectedBoard}`, {
            method: 'DELETE',
        });
        mutateBoards();
        deleteBoardModal.close();
        await router.push('/');
    };
    const deleteBoardModal = useModal({
        type: 'danger',
        dangerHeader: modalTitle,
        dangerMessage: modalMessage,
        onConfirmDelete: confirmDeleteHandler,
    });
    const DeleteBoardModal = deleteBoardModal.Component;

    const optionsPopover = usePopover();
    const Popover = optionsPopover.Component;

    const NewTaskModal = newTaskModal.Component;
    const MenuModal = mobileMenu.Component;

    const handleOptionsClick = (e: React.MouseEvent) => {
        mobileMenu.close();
        optionsPopover.toggle(e);
    };

    const handleNewTaskClick = () => {
        mobileMenu.close();
        newTaskModal.toggle();
    };

    const handleEditBoard = () => {};

    const handleDeleteBoard = () => {
        optionsPopover.close();
        deleteBoardModal.toggle();
    };

    return (
        <header className="flex items-center justify-between border-lines-light bg-white font-jakarta dark:border-lines-dark dark:bg-dark-grey dark:text-white sm:border-l">
            <div className="relative flex">
                <h1 id="board-header" className="text-lg sm:ml-6 sm:text-xl sm:font-bold lg:text-2xl">
                    {selectedBoardData?.name}
                </h1>
                <button
                    id="mobile-menu-toggle"
                    className="flex w-6 items-center justify-center sm:hidden"
                    onClick={mobileMenu.toggle}
                >
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
                    className="mr-2 md:mr-4"
                    disabled={!selectedBoardData?.columns.length}
                >
                    <span className="hidden sm:block">+ Add New Task</span>
                    <AddTaskIconMobile className="sm:hidden" />
                </ButtonPrimaryLarge>
                <NewTaskModal>
                    <NewTaskForm closeModal={newTaskModal.close} columns={selectedBoardData?.columns} />
                </NewTaskModal>
                <button
                    aria-label="Board options"
                    id="board-options"
                    className="mr-2 inline-flex w-6 justify-center"
                    onClick={handleOptionsClick}
                >
                    <VerticalEllipsisIcon className="pointer-events-none" />
                </button>
                <Popover className="mt-8 -translate-x-full md:mt-12">
                    <ul className="right-0 w-48 rounded-lg bg-white p-4 font-jakarta text-sm shadow-lg dark:bg-v-dark-grey">
                        <PopoverLink disabled={!selectedBoard} onClick={handleEditBoard} id="board-edit">
                            Edit Board
                        </PopoverLink>
                        <PopoverLink
                            disabled={!selectedBoard}
                            danger={true}
                            onClick={handleDeleteBoard}
                            id="board-delete"
                        >
                            Delete Board
                        </PopoverLink>
                    </ul>
                </Popover>
                <DeleteBoardModal />
            </div>
        </header>
    );
};

export default Header;
