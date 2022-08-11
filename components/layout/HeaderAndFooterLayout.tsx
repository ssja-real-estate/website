import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { ComponentProps } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navbar/Navbar";
interface Props {
  children: JSX.Element;
}

function HeaderAndFooterLayout({ children }: Props) {
  const router = useRouter();
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
}

export default HeaderAndFooterLayout;
