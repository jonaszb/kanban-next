import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { BoardIcon } from '../Icons/Icons';
import type { Board } from '../../types';
import { useBoardsContext } from '../../store/BoardListContext';
import useModal from '../../hooks/useModal';
import BoardForm from '../Modals/BoardForm';

const BoardLink: FC<{ board: Board }> = ({ board }) => {
    const router = useRouter();
    const isActive = router.query.boardId === board.uuid;

    return (
        <Link
            href={`/board/${board.uuid}`}
            className={`group mr-5 flex items-center rounded-r-full py-3.5 pl-3 text-base font-bold tracking-wide transition-all lg:pl-6  ${
                isActive
                    ? 'bg-primary text-white'
                    : ' text-mid-grey hover:bg-grey-highlight hover:text-primary dark:hover:bg-white'
            }`}
        >
            <BoardIcon
                className={`mr-2 min-w-[1rem] ${isActive ? 'fill-white' : 'fill-mid-grey group-hover:fill-primary'}`}
            />
            <span className=" overflow-hidden text-ellipsis whitespace-nowrap">{board.name}</span>
        </Link>
    );
};

const NewBoardButton: FC<React.ComponentProps<'button'> & { handleBoardSelect?: Function }> = (props) => {
    const { className, handleBoardSelect, ...restProps } = props;
    const router = useRouter();
    const newBoard = useModal();
    const NewBoardModal = newBoard.Component;

    const { mutateBoards } = useBoardsContext();

    const newBoardHandler = () => {
        newBoard.toggle();
    };

    const handleNewBoardCreated = (newBoardUUID: string) => {
        mutateBoards();
        newBoard.close();
        router.push(`/board/${newBoardUUID}`);
        handleBoardSelect && handleBoardSelect();
    };

    return (
        <React.Fragment>
            <button
                onClick={newBoardHandler}
                id="new-board-btn"
                className={`group flex items-center py-3.5 pl-3 font-bold tracking-wide text-primary transition-all hover:text-primary-light lg:pl-6 ${
                    className ?? ''
                }`}
                {...restProps}
            >
                <BoardIcon className="mr-2 h-4 fill-primary group-hover:fill-primary-light" />
                <span>{props.children}</span>
            </button>
            <NewBoardModal>
                <BoardForm formType="new" onNewBoardCreated={handleNewBoardCreated} />
            </NewBoardModal>
        </React.Fragment>
    );
};

const BoardList: FC<{ handleBoardSelect?: Function }> = ({ handleBoardSelect }) => {
    const boardSelectHandler = () => {
        handleBoardSelect && handleBoardSelect();
    };

    const { boards, isLoading } = useBoardsContext();
    return (
        <div id="board-list" className="flex flex-1 flex-col overflow-y-auto">
            {boards && (
                <span
                    id="board-count"
                    data-testid="board-count"
                    className="mb-5 px-3 text-xs uppercase tracking-[.2rem] text-mid-grey lg:px-6"
                >{`All Boards (${boards.length})`}</span>
            )}
            <ul
                className={`max-h-[calc(100vh-25rem)] overflow-y-scroll ${
                    boards && boards.length > 0 ? 'min-h-[4rem]' : ''
                }`}
            >
                {boards?.map((board) => (
                    <li key={board.uuid} onClick={boardSelectHandler}>
                        <BoardLink board={board} />
                    </li>
                ))}
            </ul>
            <NewBoardButton handleBoardSelect={handleBoardSelect} disabled={isLoading}>
                {isLoading ? 'Loading boards...' : '+ Create New Board'}
            </NewBoardButton>
        </div>
    );
};

export default BoardList;
