import * as MdIcon from "react-icons/md";
import * as FaIcon from "react-icons/fa";
import * as BiIcon from "react-icons/bi";
import * as IoIcon from "react-icons/io";
import * as ImIcon from "react-icons/im";
import Strings from "../../data/strings";
import Link from "next/link";
import { useEffect, useState } from "react";
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    let offset = window.scrollY;
    // console.log(offset);
    if (offset > 10) {
      setScrolled(true);
    } else if (offset < 50) {
      setScrolled(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="absolute top-0 w-full select-none">
      <div
        className={`${
          scrolled && "fixed w-full "
        } sm:static w-full h-10 text-white bg-black/20  z-10`}
      >
        <div className="container flex flex-row justify-between items-center h-full">
          <div className="flex h-full items-center sm:hidden">
            <IoIcon.IoIosMenu className="w-6 h-6" />
          </div>
          <div className="flex flex-row items-center gap-2 bg-black/30 h-full px-2 text-sm">
            <MdIcon.MdPhoneEnabled className="w-5 h-5" />
            <span dir="ltr"> {Strings.phoneNumber}</span>
          </div>
          <div className="h-full hidden sm:flex flex-row items-center gap-3">
            <FaIcon.FaTelegram className="w-6 h-6" />
            <FaIcon.FaInstagram className="w-6 h-6" />
            <FaIcon.FaWhatsapp className="w-6 h-6" />
          </div>
          <div className="hidden sm:flex flex-row h-full items-center gap-2">
            <BiIcon.BiUser className="w-5 h-5" />
            <span>{Strings.loginOrSignup}</span>
          </div>
        </div>
      </div>
      <div
        className={`hidden z-10 fixed transition-all duration-300 ${
          scrolled
            ? "top-0 h-20 bg-white text-gray-600 w-full px-4 shadow-md"
            : "top-10 text-white bg-transparent container h-28"
        } inset-0 sm:flex flex-row justify-between items-center`}
      >
        <div
          className={`${
            scrolled && "container"
          } flex flex-row justify-between items-center w-full`}
        >
          <div className="flex flex-row items-center gap-3">
            <ImIcon.ImSection className=" w-10 h-10" />
            <h1 className="text-lg">
              <Link href="/">{Strings.sajaSystem}</Link>
            </h1>
          </div>
          <div className="flex-1">
            <ul className="flex flex-row justify-end sm:gap-3 sm:text-[13px] md:text-sm lg:text-base md:gap-4 lg:gap-8">
              <li>
                <Link href="/">{Strings.addEstates}</Link>
              </li>
              <li>
                <Link href="/">{Strings.searchEstates}</Link>
              </li>
              <li>
                <Link href="/">{Strings.inquiries}</Link>
              </li>
              <li>
                <Link href="/">{Strings.contractSamples}</Link>
              </li>
              <li>
                <Link href="/">{Strings.laws}</Link>
              </li>
              <li>
                <Link href="/">{Strings.commissionCalculation}</Link>
              </li>
              <li>
                <Link href="/">{Strings.commissionCalculation}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
