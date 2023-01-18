import Head from 'next/head';
import Board from '../../../components/Board/Board';
import { useRouter } from 'next/router';
import type { Columns } from '../../../types';

const testColumns: Columns = {
    todo: {
        color: '#49C4E5',
        tasks: [
            {
                title: 'Placeholder 1',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Placeholder 2',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Placeholder 3',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
        ],
    },
    doing: {
        color: '#8471F2',
        tasks: [
            {
                title: 'Placeholder 4',
                subtasksDone: 1,
                subtasksTotal: 3,
            },
            {
                title: 'Placeholder 5',
                subtasksDone: 2,
                subtasksTotal: 2,
            },
            {
                title: 'Placeholder 6',
                subtasksDone: 0,
                subtasksTotal: 10,
            },
        ],
    },
    done: {
        color: '#67E2AE',
        tasks: [],
    },
};

export default function BoardPage() {
    const router = useRouter();
    const uuid = router.query.boardId as string; // TODO - Handle undefined and array cases

    return (
        <>
            <Head>
                <title>Kanban Board</title>
                <meta name="description" content="Kanban project management tool" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className="text-bold flex h-full flex-col items-center justify-center overflow-scroll p-6 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                <Board boardUUID={uuid} columns={testColumns} />
            </main>
        </>
    );
}
