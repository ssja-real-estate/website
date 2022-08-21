import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { ComponentProps, useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navbar/Navbar";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalState } from "../../global/states/globalStates";
import { getRouteMatcher } from "next/dist/shared/lib/router/utils/route-matcher";

interface Props {
  children: JSX.Element;
}

const HeaderAndFooterLayout = ({ children }: Props) => {
  const state = useRecoilValue(globalState);
  const [loaded, setLoaded] = useState(false);
  console.log(loaded);

  const router = useRouter();
  useEffect(() => {
    if (router.route === "/dashboard" && !state.loggedIn) {
      router.push("/login");
    } else {
      setLoaded(true);
    }
  });
  if (!loaded) {
    return <div></div>;
  }
  if (router.pathname === "/login" || router.pathname === "/signup") {
    return (
      <div className="flex flex-col min-h-screen">
        <main>{children}</main>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header>
          <Navbar />
        </Header>
      </header>

      <main>{children}</main>

      <footer className="sticky top-[100vh]">
        <Footer />
      </footer>
    </div>
  );
};

export default HeaderAndFooterLayout;
