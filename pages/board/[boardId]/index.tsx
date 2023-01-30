import Head from 'next/head';
import Board from '../../../components/Board/Board';
import { useRouter } from 'next/router';

export default function BoardPage() {
    const router = useRouter();
    const uuid = router.query.boardId as string;

    return (
        <>
            <Head>
                <title>Kanban Board</title>
                <meta name="description" content="Kanban project management tool" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className="text-bold flex h-full flex-col items-center justify-center overflow-scroll p-6 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                {uuid && <Board boardUUID={uuid} />}
            </main>
        </>
    );
}
