import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout/Layout';
import ThemeContextProvider from '../store/ThemeContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeContextProvider>
    );
}
