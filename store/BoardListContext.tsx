import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect } from 'react';
import { Board } from '../types';
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';
import { fetcher } from '../utils/utils';
import { useSession } from 'next-auth/react';

export type BoardListContextProps = {
    boards?: Board[];
    selectedBoard: Board | null;
    selectedTask: string | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<string | null>>;
    mutateBoards: KeyedMutator<Board[]>;
    isLoading: boolean;
    isValidating: boolean;
    error: any;
};

export const BoardListContext = React.createContext<BoardListContextProps>({
    boards: [],
    selectedBoard: null,
    selectedTask: null,
    setSelectedTask: () => null,
    isLoading: false,
    isValidating: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
});

const BoardListContextProvider: React.FC<PropsWithChildren<{ value?: BoardListContextProps }>> = (props) => {
    const session = useSession();
    if (!session || session.status === 'unauthenticated') {
        return <>{props.children}</>;
    }

    const router = useRouter();

    const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null);
    const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
    const {
        data: boards,
        mutate: mutateBoards,
        isLoading,
        isValidating,
        error,
    } = useSWR<Board[]>(`/api/boards`, fetcher);

    useEffect(() => {
        setSelectedBoard(boards?.find((board) => board.uuid === router.query.boardId) ?? null);
    }, [boards, router.query.boardId]);

    const contextValue = {
        boards,
        selectedBoard,
        selectedTask,
        setSelectedTask,
        isLoading,
        isValidating,
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
