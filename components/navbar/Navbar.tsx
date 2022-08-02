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
  const [isShowMobileMenu, setIsShowMobile] = useState(false);

  const handleScroll = () => {
    let offsetY = window.scrollY;

    // console.log(offset);
    if (offsetY > 10) {
      setScrolled(true);
    } else if (offsetY < 10) {
      setScrolled(false);
    }
  };
  const handleResize = () => {
    let width = window.innerWidth;
    if (width > 639) {
      setIsShowMobile(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    if (isShowMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isShowMobileMenu]);
  return (
    <div className="absolute top-0 w-full select-none">
      <div
        className={`${
          scrolled && "fixed w-full "
        } sm:static w-full h-12 text-white bg-black/20  z-10`}
      >
        <div className="container flex flex-row justify-between items-center h-full">
          <div
            onClick={() => setIsShowMobile(true)}
            className="flex h-full items-center sm:hidden"
          >
            <IoIcon.IoIosMenu className="w-8 h-8" />
          </div>
          <div
            onClick={() => setIsShowMobile(false)}
            className={`fixed top-0 bottom-0 w-full ${
              isShowMobileMenu ? "right-0" : "-right-[20000px]"
            } bg-black/40  z-20`}
          ></div>
          <div
            className={`fixed top-0 bottom-0 w-64 z-30 transition-all duration-500 ease-in-out ${
              isShowMobileMenu ? "right-0" : "-right-[20000px]"
            }  bg-[#0ba]`}
          >
            <div className="flex flex-col items-start justify-between h-full py-2">
              <div className="w-full">
                <IoIcon.IoMdCloseCircle
                  className="bg-[#0ba] w-10 h-10 mr-4"
                  onClick={() => setIsShowMobile(false)}
                />
                <ul className="flex flex-col mt-4 w-full divide-y">
                  <li className="flex items-center h-full w-full px-4 py-2">
                    <Link href="/">{Strings.addEstates}</Link>
                  </li>
                  <li className="flex items-center h-full w-full px-4 py-2">
                    <Link href="/">{Strings.searchEstates}</Link>
                  </li>
                  <li className="flex items-center h-full w-full px-4 py-2">
                    <Link href="/">{Strings.inquiries}</Link>
                  </li>
                  <li className="flex items-center h-full w-full px-4 py-2">
                    <Link href="/">{Strings.contractSamples}</Link>
                  </li>
                  <li className="flex items-center h-full w-full px-4 py-2">
                    <Link href="/">{Strings.laws}</Link>
                  </li>
                  <li className="flex items-center h-full w-full px-4 py-2">
                    <Link href="/">{Strings.commissionCalculation}</Link>
                  </li>
                </ul>
              </div>
              <div className="w-full flex flex-col gap-4 justify-center items-center">
                <div className="">
                  <div className="flex flex-row justify-center items-center">
                    {/* <ImIcon.ImSection className=" w-10 h-10" /> */}
                    <h1 className="text-lg">
                      <Link href="/">{Strings.sajaSystem}</Link>
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2 bg-black/20 h-10 px-2 text-sm">
                  <MdIcon.MdPhoneEnabled className="w-5 h-5" />
                  <span dir="ltr"> {Strings.phoneNumber}</span>
                </div>
                <div className="flex flex-row gap-2">
                  <FaIcon.FaTelegram className="w-6 h-6" />
                  <FaIcon.FaInstagram className="w-6 h-6" />
                  <FaIcon.FaWhatsapp className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-row items-center gap-2 bg-black/30 h-full px-2 text-sm">
            <MdIcon.MdPhoneEnabled className="w-5 h-5" />
            <span dir="ltr"> {Strings.phoneNumber}</span>
          </div>

          <div className="h-full hidden sm:flex flex-row items-center gap-3">
            <FaIcon.FaTelegram className="w-6 h-6" />
            <FaIcon.FaInstagram className="w-6 h-6" />
            <FaIcon.FaWhatsapp className="w-6 h-6" />
          </div>
          <div className="flex flex-row h-full items-center gap-2">
            <BiIcon.BiUser className="w-5 h-5" />
            <span>{Strings.loginOrSignup}</span>
          </div>
        </div>
      </div>
      <div
        className={`hidden z-10 fixed transition-all duration-300 ${
          scrolled
            ? "top-0 h-20 bg-white text-gray-600 w-full px-4 shadow-md"
            : "top-12 text-white bg-transparent container h-28"
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
