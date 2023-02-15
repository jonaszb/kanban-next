import Head from 'next/head';
import { FC, PropsWithChildren, useContext } from 'react';
import { LogoDark, LogoLight } from '../../components/Icons/Icons';
import { ThemeContext } from '../../store/ThemeContext';
import { signIn, getSession } from 'next-auth/react';

const ProviderButton: FC<PropsWithChildren<{ provider: string; className?: string; icon?: string }>> = (props) => {
    return (
        <button
            onClick={() => signIn(props.provider)}
            className={`mt-4 flex w-full items-center justify-center rounded-md py-3 px-4 font-bold ${
                props.className ?? ''
            }`}
        >
            {props.icon && <img src={props.icon} alt={`${props.provider} icon`} className="h-6 w-6" />}
            <span className="flex-grow">{props.children}</span>
        </button>
    );
};

export default function Home() {
    const { darkModeEnabled } = useContext(ThemeContext);

    return (
        <div className={darkModeEnabled ? 'dark' : ''}>
            <Head>
                <title>Kanban - Login</title>
                <meta name="description" content="Task management web app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <main className="flex h-screen bg-light-grey font-jakarta dark:bg-v-dark-grey">
                <div className="relative m-auto flex h-96 w-72 sm:w-96">
                    <div className="z-10 flex w-full flex-col items-center justify-center rounded-lg bg-white p-12 shadow-lg dark:bg-dark-grey ">
                        {darkModeEnabled ? <LogoLight /> : <LogoDark />}
                        <p className="mt-16 text-mid-grey dark:text-light-grey">Sign in to continue</p>
                        <ProviderButton
                            className="border border-mid-grey bg-black text-white dark:border-none"
                            provider="github"
                            icon="https://authjs.dev/img/providers/github-dark.svg"
                        >
                            Sign in with GitHub
                        </ProviderButton>

                        <ProviderButton
                            className="border border-mid-grey bg-white text-black dark:border-none"
                            provider="google"
                            icon="https://authjs.dev/img/providers/google.svg"
                        >
                            Sign in with Google
                        </ProviderButton>
                    </div>
                    <div className="absolute left-12 top-8 h-80 w-48 sm:left-8 sm:top-8 sm:w-80 sm:animate-spin-slow">
                        <div className="absolute left-4 top-16 h-48 w-48 animate-[background-float_16s_ease-in-out_infinite_4s] rounded-full bg-primary bg-blend-multiply blur-2xl dark:opacity-75" />
                        <div className="absolute right-4 top-4 h-48 w-48 animate-[background-float_16s_ease-in-out_infinite_8s] rounded-full bg-primary-light bg-blend-multiply blur-2xl dark:opacity-75" />
                        <div className="absolute right-4 bottom-2 h-48 w-48 animate-[background-float_16s_ease-in-out_infinite_10s] rounded-full bg-gradient-to-t from-primary to-primary-light bg-blend-multiply blur-2xl dark:opacity-75" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
