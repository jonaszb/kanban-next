import { Board } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample data for boards and board list context
const sharedProps = {
    created_at: new Date(),
    updated_at: new Date(),
    user_uuid: uuidv4(),
    columns: [],
};
export const testBoards: Board[] = [
    {
        name: 'Platform Launch',
        uuid: uuidv4(),
        id: 1,
        ...sharedProps,
    },
    {
        name: 'Marketing Plan',
        uuid: uuidv4(),
        id: 2,
        ...sharedProps,
    },
    {
        name: 'Roadmap',
        uuid: uuidv4(),
        id: 3,
        ...sharedProps,
    },
];

export const boardsCtxValue = {
    boards: testBoards,
    selectedBoard: testBoards[1].uuid,
    isLoading: false,
    error: null,
    mutateBoards: () => Promise.resolve([]),
};

export * from '@testing-library/react';
