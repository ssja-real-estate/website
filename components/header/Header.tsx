import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "../navbar/Navbar";

function Header(props: any) {
  const router = useRouter();

  if (router.pathname === "/") {
    return (
      <div className="relative h-screen">
        <Image
          className="z-0"
          src="/image/home-bg.jpg"
          layout="fill"
          objectPosition="center"
          objectFit="cover"
          alt="home"
        />
        {props.children}
      </div>
    );
  } else {
    return <div className="">{props.children}</div>;
  }
}

export default Header;
