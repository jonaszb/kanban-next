import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout/Layout';
import ThemeContextProvider from '../store/ThemeContext';
import BoardListContextProvider from '../store/BoardListContext';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <ThemeContextProvider>
                <BoardListContextProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </BoardListContextProvider>
            </ThemeContextProvider>
        </SessionProvider>
    );
}
