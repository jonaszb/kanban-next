import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect } from 'react';
import { Board } from '../types';

export type BoardListContextProps = {
    boards: Board[];
    selectedBoard: string | null;
};

export const BoardListContext = React.createContext<BoardListContextProps>({
    boards: [],
    selectedBoard: null,
});

const BoardListContextProvider: React.FC<PropsWithChildren<{ value?: BoardListContextProps }>> = (props) => {
    const router = useRouter();

    const [boards, setBoards] = React.useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = React.useState<string | null>(null);

    useEffect(() => {
        fetch('/api/boards')
            .then((res) => res.json())
            .then((data) => {
                setBoards(data);
            });
    }, []);

    useEffect(() => {
        setSelectedBoard(router.query.boardId as string);
    }, [router.query.boardId]);

    const contextValue = {
        boards,
        selectedBoard,
    };

    return <BoardListContext.Provider value={props.value ?? contextValue}>{props.children}</BoardListContext.Provider>;
};

export default BoardListContextProvider;
