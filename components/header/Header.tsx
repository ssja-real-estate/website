import Image from "next/image";
import React from "react";
import Navbar from "../navbar/Navbar";

function Header() {
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
      <Navbar />
    </div>
  );
}

export default Header;
