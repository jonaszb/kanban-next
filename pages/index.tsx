import Head from 'next/head';
import { ButtonPrimaryLarge } from '../components/Buttons/Buttons';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    return (
        <>
            <Head>
                <title>Kanban Board</title>
                <meta name="description" content="Task management web app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className="text-bold flex h-full flex-col items-center justify-center overflow-scroll px-4 text-center font-jakarta text-lg text-mid-grey dark:text-white">
                <p id="empty-board-msg" className="mb-8">
                    The board is empty. Create a new column to get started
                </p>
                <ButtonPrimaryLarge id="new-column-btn">+ Add New Column</ButtonPrimaryLarge>
            </main>
        </>
    );
}
