import * as MdIcon from "react-icons/md";
import * as FaIcon from "react-icons/fa";
import * as BiIcon from "react-icons/bi";
import * as IoIcon from "react-icons/io";
import * as ImIcon from "react-icons/im";
import * as GoIcon from "react-icons/go";

import Strings from "../../data/strings";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { globalState } from "../../global/states/globalStates";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Role } from "../../global/types/User";
import { ownerSectionAtom } from "../dashboard/owner-dashboard/OwnerDashboard";
import { Document } from "../../global/types/document";
import commissionModalState from "../CommissionModal/CommissionModalState";
import CommissionModal from "../CommissionModal/CommissionModal";
import Image from "next/image";
import DocumentService from "../../services/api/DocumentService/DocumentService";
import { baseApiUrl } from "mapbox-gl";
import BaseService from "../../services/api/BaseService";

function Navbar() {
  const [modalState, setModalState] = useRecoilState(commissionModalState);
  const state = useRecoilValue(globalState);
  const setGlobalState = useSetRecoilState(globalState);
  const router = useRouter();
  const [section, setSection] = useRecoilState(ownerSectionAtom);
  const [isUserValide, setIsUserValid] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const documentService=useRef( new DocumentService())
  const [isShowMobileMenu, setIsShowMobile] = useState(false);
  const [username, setUsername] = useState(Strings.loginOrSignup);
  const bgTopNavbar = "bg-[#0ba]";

  const loginHanler = () => {

    state.loggedIn ? () => {} : router.push("/login");
  };

  const [documents,setDocuments]=useState<Document[]>([])
  const [documenttype1,setDocumenttype1]=useState<Document[]>([])
  const handleScroll = () => {
    let offsetY = window.scrollY;

    // console.log(offset);
    if (offsetY > 500) {
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
    state.loggedIn
      ? setUsername(state.name)
      : setUsername(Strings.loginOrSignup);
    state.loggedIn ? setIsUserValid(true) : setIsUserValid(false);
  
    documentService.current.getDocument().then((value:Document[]) => {
      setDocuments(value.filter((item:Document)=>item.type==2));
      setDocumenttype1(value.filter((item)=>item.type==1))
    })
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
  }, [isShowMobileMenu, state]);

  const goto = (path: string): void => {
    setIsShowMobile(false);
    router.push(path);
  };
  const exite = () => {
    router.push("/");
    setGlobalState({
      loggedIn: false,
      role: Role.USER,
      token: "",
      userId: "",
      name: "",
    });
    setSection("profile");
  };

  return (
    <div className="w-full select-none">
      <CommissionModal />
      <div
        className={`${
          scrolled && "fixed w-full "
        } sm:static w-full h-24 ext-white ${bgTopNavbar}  z-10`}
      >
        <div className="container flex flex-row justify-between items-center h-full">
          <div
            onClick={() => setIsShowMobile(true)}
            className="flex h-full items-center sm:hidden cursor-pointer"
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
                  className="bg-[#0ba] w-10 h-10 mr-4 cursor-pointer"
                  onClick={() => setIsShowMobile(false)}
                />
                <ul className="flex flex-col mt-4 w-full divide-y">
                  <li
                    onClick={() => goto("/")}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.home}
                  </li>
                  <li
                    onClick={() => goto("/search-estate")}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.searchEstates}
                  </li>
                  <li
                    onClick={() => goto("/")}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.inquiries}
                  </li>
                  <li
                    onClick={() => goto("/")}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.amlaklaw}
                  </li>
                  <li
                    onClick={() => goto("/")}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.contractSamples}
                  </li>
                  <li
                    onClick={() => goto("/")}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.laws}
                  </li>
                  <li
                    onClick={() => {
                      setModalState({
                        ...modalState,
                        showCommissionModal: true,
                      });
                    }}
                    className="flex items-center h-full w-full px-4 py-2 cursor-pointer"
                  >
                    {Strings.commissionCalculation}
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
                <Link
              href={'t.me/samane_ssja'}

            >
              <Image src="/icon/telegram.png" width={24} height={24} alt="telegram"></Image>
       
            </Link>
            <Link
              href= {'instagram.com/ssja.ir?igshid=MzRlODBiNWFlZA=='}
            >
              <Image src="/icon/instagram.png" width={24} height={24} alt="instagram"></Image>
            </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-row items-end gap-2  h-full px-2 text-sm">
            {/* <MdIcon.MdPhoneEnabled className="w-5 h-5" /> */}
            {/* <img src="/logo2.png" height={120} width={120}></img> */}
            <div className="w-[100px]">
              <Image
                src="/image/logo/logo2.png"
                // layout="responsive"
                width="100"
                height="100"
                alt="logo"
              />
            </div>
            <span className=" font-['nastaliq']  text-4xl" dir="ltr">
              {Strings.sajaSystem }
            </span>
          </div>

          {/* <div className="h-full  hidden sm:flex flex-row items-center gap-3">
            <Link
              href="
https://t.me/samane_ssja"
            >
              <Image src="/icon/telegram.png" width={24} height={24} alt="telegram"></Image>
       
            </Link>
            <Link
              href="
https://instagram.com/ssja.ir?igshid=MzRlODBiNWFlZA==
"
            >
              <Image src="/icon/instagram.png" width={24} height={24} alt="instagram"></Image>
            </Link>
          </div> */}
          <div
            onClick={() => {
              loginHanler();
            }}
            className="flex flex-row h-full items-center gap-2 group relative"
          >
            <div className="flex flex-row items-center gap-2 cursor-pointer ">
              <BiIcon.BiUser className="w-5 h-5" />
              <span>{username}</span>
              {isUserValide && (
                <div className="absolute right-0 hidden w-full group-hover:block top-full bg-white text-gray-700 z-30 rounded-br-md rounded-bl-md shadow-md">
                  <ul className="flex flex-col justify-start items-center w-full text-sm">
                    <li
                      onClick={() => router.push("/dashboard")}
                      className="flex flex-row  gap-2 py-2 cursor-pointer"
                    >
                      <GoIcon.GoDashboard className="w-5 h-6 text-[#2c3e50]" />
                      <span className="text-[#a6a6a6] underline group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300">
                        داشبورد
                      </span>
                    </li>
                    <li
                      onClick={() => exite()}
                      className="flex flex-row gap-2 py-2 cursor-pointer"
                    >
                      <MdIcon.MdOutlineExitToApp className="w-5 h-6 text-[#2c3e50]" />
                      <span className="text-[#a6a6a6] underline group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300">
                        خروج
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`hidden z-50  transition-all duration-300 inset-0 sm:flex flex-row justify-between items-center ${
          scrolled
            ? "fixed top-0 h-16 bg-white text-gray-600 w-full shadow-md"
            : "top-12 bg-[#f6f6f6] text-gray-600 container h-16"
        }
        `}
      >
        <div
          className={`${
            scrolled && "container"
          } flex flex-row justify-between items-center w-full`}
        >
          <div className="flex flex-row items-center gap-3">
            {/* <ImIcon.ImSection className=" w-10 h-10" />
            <h1 className="text-lg">
              <Link href="/">{Strings.sajaSystem}</Link>
            </h1> */}
            <ul className="flex flex-row justify-end sm:gap-3 sm:text-[13px] md:text-sm lg:text-base md:gap-4 lg:gap-8">
            <li>
                <Link href="/"> صفحه اصلی</Link>
              </li>
              <li>
                <Link href="/add-estate">ثبت املاک</Link>
              </li>
              <li>
                <Link href="/search-estate">{Strings.searchEstates}</Link>
              </li>
            </ul>
        
          </div>
          <div className="flex-1">
            <ul className="flex flex-row justify-end sm:gap-3 sm:text-[13px] md:text-sm lg:text-base md:gap-4 lg:gap-8">
              <li className="relative group cursor-pointer">
                {Strings.inquiries}
                <ul className="absolute z-10 w-[250%] bg-white rounded-md p-4 group-hover:flex flex-col gap-2 text-sm hidden">
                  <li>
                    <Link href="https://my.ssaa.ir/portal/estate/originality-document/">
                      استعلام سند
                    </Link>
                  </li>
                  <li>
                    <Link href="https://my.ssaa.ir/portal/ssar/originality-document/">
                      استعلام وکالت نامه
                    </Link>
                  </li>
                  <li>
                    <Link href="https://cbi.ir/simplelist/19689.aspx">
                      استعلام چک صیادی
                    </Link>
                  </li>
                  <li>
                    <Link href="https://geoplaner.com">
                      استعلام موقعیت جغرافیایی ملک
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.iranamlaak.ir/Forms/Contracts/FilterContractsByContractSide.aspx">
                      استعلام کد رهگیری قراردادها
                    </Link>
                  </li>
                  <li>
                    <Link href="https://iranianasnaf.ir/forms/public/nationalcodeinquiry/default.aspx">
                      استعلام پروانه بر مبنای کد ملی
                    </Link>
                  </li>
                  <li>
                    <Link href="https://iranianasnaf.ir/forms/public/postalcodeinquiry/default.aspx">
                     استعلام واحد دارای پروانه بر مبنای کد پستی
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative group cursor-pointer">
              {Strings.amlaklaw}
              <ul className="absolute z-10 w-[250%] bg-white rounded-md p-4 group-hover:flex flex-col gap-2 text-sm hidden">
                {
                  documenttype1.map((item:Document)=>
                  <li key={item.id}>
                  <Link href={"https:/ssja.ir/api/getdocument/"+item.path}>
                    {item.title}
                   </Link>
                </li>
                  )
                }
              
            
              </ul>
              </li>
              <li className="relative group cursor-pointer">
              {Strings.contractSamples}
              <ul className="absolute z-10 w-[250%] bg-white rounded-md p-4 group-hover:flex flex-col gap-2 text-sm hidden">
                {
                  documents.map((item:Document)=>
                  <li key={item.id}>
                  <Link href={"https:/ssja.ir/api/getdocument/"+item.path}>
                    {item.title}
                   </Link>
                </li>
                  )
                }
              
            
              </ul>
              </li>
              <li>
                <Link href="/laws">{Strings.laws}</Link>
              </li>
              <li
                onClick={() => {
                  setModalState({
                    ...modalState,
                    showCommissionModal: true,
                  });
                }}
                className="cursor-pointer"
              >
                {Strings.commissionCalculation}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
