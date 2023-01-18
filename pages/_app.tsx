import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout/Layout';
import ThemeContextProvider from '../store/ThemeContext';
import BoardListContextProvider from '../store/BoardListContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeContextProvider>
            <BoardListContextProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </BoardListContextProvider>
        </ThemeContextProvider>
    );
}
