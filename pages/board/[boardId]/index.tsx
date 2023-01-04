import Head from 'next/head';
import { ReactElement } from 'react';
import Layout from '../../../components/layout/Layout';
import { ButtonPrimaryLarge } from '../../../components/Buttons/Buttons';

export default function BoardPage() {
    return (
        <>
            <Head>
                <title>Kanban Board</title>
                <meta name="description" content="Kanban project management tool" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className="text-bold flex h-full flex-col items-center justify-center overflow-scroll px-4 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                <p className="mb-8">The board is empty. Create a new column to get started</p>
                <ButtonPrimaryLarge>+ Add New Column</ButtonPrimaryLarge>
            </main>
        </>
    );
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
