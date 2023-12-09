import Head from 'next/head';
import { FC, PropsWithChildren, useContext } from 'react';
import { LogoDark, LogoLight } from '../../components/Icons/Icons';
import { ThemeContext } from '../../store/ThemeContext';
import { signIn, getSession, GetSessionParams } from 'next-auth/react';
import { Input } from '../../components/Inputs/Inputs';
import { ButtonPrimary } from '../../components/Buttons/Buttons';
import useInput from '../../hooks/useInput';

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
    const emailInput = useInput<string>({
        validateFn: (value) => {
            if (!value) return [false, ''];
            if (
                // Valid email regex
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    value.toLocaleLowerCase()
                )
            ) {
                return [true, ''];
            }
            return [false, 'Invalid email'];
        },
    });

    const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        emailInput.setIsTouched(true);
        if (!emailInput.hasError) {
            signIn('email', { email: emailInput.value });
        }
    };

    return (
        <div className={darkModeEnabled ? 'dark' : ''}>
            <Head>
                <title>Kanban - Login</title>
                <meta name="description" content="Task management web app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <main className="flex h-screen bg-light-grey font-jakarta dark:bg-v-dark-grey">
                <div className="relative m-auto flex w-72 sm:w-96">
                    <div className="z-10 flex w-full flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg dark:bg-dark-grey sm:p-12 ">
                        {darkModeEnabled ? <LogoLight className="mb-8" /> : <LogoDark className="mb-8" />}
                        <form className="w-full" onSubmit={handleEmailSubmit}>
                            <Input
                                label="Email"
                                hideLabel={true}
                                placeholder="mail@example.com"
                                onChange={emailInput.valueChangeHandler}
                                value={emailInput.value ?? ''}
                                errorMsg={emailInput.errorMsg}
                                haserror={emailInput.hasError}
                                onBlur={emailInput.inputBlurHandler}
                            />
                            <ButtonPrimary className="mt-4">Sign in with email</ButtonPrimary>
                        </form>
                        <div className="mt-6 mb-2 h-px w-full bg-mid-grey" />
                        <ProviderButton
                            className="border border-mid-grey bg-black text-white dark:border-none"
                            provider="github"
                            icon="https://authjs.dev/img/providers/github.svg"
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

export async function getServerSideProps(context: GetSessionParams) {
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
