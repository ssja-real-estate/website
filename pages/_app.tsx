import "../styles/globals.css";
import type { AppProps } from "next/app";
import HeaderAndFooterLayout from "../components/layout/HeaderAndFooterLayout";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <HeaderAndFooterLayout>
        <Component {...pageProps} />
      </HeaderAndFooterLayout>
    </RecoilRoot>
  );
}

export default MyApp;
