import Head from 'next/head';
import Board from '../../../components/Board/Board';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Columns } from '../../../types';

export default function BoardPage() {
    const router = useRouter();
    const [columns, setColumns] = useState<Columns | null>(null);
    const uuid = router.query.boardId as string;

    useEffect(() => {
        if (uuid) {
            fetch(`/api/boards/${uuid}`)
                .then((res) => res.json())
                .then((data) => {
                    const newValue: Columns = {};
                    for (const column of data.columns) {
                        newValue[column.name] = {
                            color: column.color,
                            tasks: column.tasks ?? [],
                        };
                    }
                    setColumns(newValue);
                })
                .catch((err) => {
                    router.push('/');
                });
        }
    }, [uuid]);

    return (
        <>
            <Head>
                <title>Kanban Board</title>
                <meta name="description" content="Kanban project management tool" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className="text-bold flex h-full flex-col items-center justify-center overflow-scroll p-6 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                {uuid && columns && <Board boardUUID={uuid} columns={columns} />}
            </main>
        </>
    );
}
