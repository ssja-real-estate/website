import "../styles/globals.css";
import type { AppProps } from "next/app";
import HeaderAndFooterLayout from "../components/layout/HeaderAndFooterLayout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HeaderAndFooterLayout>
      <Component {...pageProps} />
    </HeaderAndFooterLayout>
  );
}

export default MyApp;
