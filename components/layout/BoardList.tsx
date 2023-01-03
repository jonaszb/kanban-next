import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { BoardIcon } from '../Icons/Icons';

const boards = [
    { id: 1, name: 'Platform Launch' },
    { id: 2, name: 'Product Roadmap' },
    { id: 3, name: 'Marketing Campaign' },
];

const BoardLink: FC<{ board: { id: number; name: string } }> = ({ board }) => {
    const router = useRouter();
    const isActive = router.query.boardId === board.id.toString();

    return (
        <Link
            href={`/${board.id}`}
            className={`group mr-5 flex items-center rounded-r-full py-3.5 pl-3 text-base font-bold tracking-wide transition-all lg:pl-6  ${
                isActive
                    ? 'bg-primary text-white'
                    : ' text-mid-grey hover:bg-light-grey hover:text-primary dark:hover:bg-white'
            }`}
        >
            <BoardIcon
                className={`mr-2 h-4 w-fit  ${isActive ? 'fill-white' : 'fill-mid-grey group-hover:fill-primary'}`}
            />
            <span>{board.name}</span>
        </Link>
    );
};

const NewBoardButton: FC<React.ComponentProps<'button'>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <button
            className={`group flex items-center py-3.5 pl-3 font-bold tracking-wide text-primary transition-all hover:text-primary-light lg:pl-6 ${
                className ?? ''
            }`}
            {...restProps}
        >
            <BoardIcon className="mr-2 h-4 fill-primary group-hover:fill-primary-light" />
            <span>+ Create New Board</span>
        </button>
    );
};

const BoardList = () => {
    return (
        <div className="flex flex-1 flex-col overflow-y-auto">
            <span className="mb-5 px-3 text-xs uppercase tracking-[.2rem] text-mid-grey lg:px-6">{`All Boards (${boards.length})`}</span>
            {boards.map((board) => (
                <BoardLink key={board.id} board={board} />
            ))}
            <NewBoardButton />
        </div>
    );
};

export default BoardList;
