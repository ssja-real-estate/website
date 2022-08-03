import { AppProps } from "next/app";
import React, { ComponentProps } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navbar/Navbar";

function HeaderAndFooterLayout(props: any) {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header>
          <Navbar />
        </Header>
      </header>
      <main>{props.children}</main>
      <footer className="sticky top-[100vh]">
        <Footer />
      </footer>
    </div>
  );
}

export default HeaderAndFooterLayout;
