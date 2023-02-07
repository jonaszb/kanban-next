import Head from 'next/head';
import Board from '../../../components/Board/Board';
import { useBoardsContext } from '../../../store/BoardListContext';

export default function BoardPage() {
    const { selectedBoard } = useBoardsContext();
    return (
        <>
            <Head>
                <title>{`Kanban - ${selectedBoard?.name}`}</title>
                <meta name="description" content={`Task management web app`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <main className="text-bold h-full flex-col overflow-scroll p-6 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                {selectedBoard && <Board boardUUID={selectedBoard.uuid} />}
            </main>
        </>
    );
}
