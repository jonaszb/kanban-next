import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect } from 'react';
import { Board } from '../types';
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';
import { fetcher } from '../utils/utils';

export type BoardListContextProps = {
    boards?: Board[];
    selectedBoard: Board | null;
    mutateBoards: KeyedMutator<Board[]>;
    isLoading: boolean;
    error: any;
};

export const BoardListContext = React.createContext<BoardListContextProps>({
    boards: [],
    selectedBoard: null,
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
});

const BoardListContextProvider: React.FC<PropsWithChildren<{ value?: BoardListContextProps }>> = (props) => {
    const router = useRouter();

    const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null);
    const { data: boards, mutate: mutateBoards, isLoading, error } = useSWR<Board[]>(`/api/boards`, fetcher);

    useEffect(() => {
        setSelectedBoard(boards?.find((board) => board.uuid === router.query.boardId) ?? null);
    }, [boards, router.query.boardId]);

    const contextValue = {
        boards,
        selectedBoard,
        isLoading,
        error,
        mutateBoards,
    };

    return <BoardListContext.Provider value={props.value ?? contextValue}>{props.children}</BoardListContext.Provider>;
};

export function useBoardsContext() {
    const context = React.useContext(BoardListContext);

    if (!context) {
        throw new Error('You need to wrap Provider.');
    }

    return context;
}

export default BoardListContextProvider;
