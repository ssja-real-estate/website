/* ===== components/Navbar.tsx ===== */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import * as MdIcon from "react-icons/md";
import * as BiIcon from "react-icons/bi";
import * as IoIcon from "react-icons/io";
import * as GoIcon from "react-icons/go";

import Strings from "../../data/strings";
import { globalState } from "../../global/states/globalStates";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Role } from "../../global/types/User";
import { ownerSectionAtom } from "../dashboard/owner-dashboard/OwnerDashboard";
import commissionModalState from "../CommissionModal/CommissionModalState";
import CommissionModal from "../CommissionModal/CommissionModal";
import { Document } from "../../global/types/document";
import DocumentService from "../../services/api/DocumentService/DocumentService";

import { MdKeyboardArrowDown } from "react-icons/md";

/* ---------- type ---------- */
interface MenuItem {
  label: string;
  path?: string;
  external?: boolean;
  action?: "modal";
  children?: MenuItem[];
}

/* ---------- Mobile menu component ---------- */
function MobileMenu({
  items,
  openSubs,
  toggleSub,
  closeDrawer,
  openModal,
  router,
}: {
  items: MenuItem[];
  openSubs: Record<string, boolean>;
  toggleSub: (l: string) => void;
  closeDrawer: () => void;
  openModal: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  /* هندلر عمومی کلیک آیتم ساده */
  const handleItemClick = (it: MenuItem) => {
    if (it.action === "modal") {
      openModal();
      closeDrawer();
    } else if (it.external && it.path) {
      window.open(it.path, "_blank", "noopener,noreferrer");
      closeDrawer();
    } else if (it.path) {
      router.push(it.path);
      closeDrawer();
    }
  };

  return (
    <ul className="flex flex-col mt-4 w-full divide-y">
      {items.map((item) =>
        item.children ? (
          <li key={item.label} className="select-none">
            <button
              onClick={() => toggleSub(item.label)}
              className="flex items-center justify-between w-full px-4 py-2"
            >
              <span>{item.label}</span>
              <MdKeyboardArrowDown
                className={`transition-transform duration-300 ${
                  openSubs[item.label] ? "rotate-180" : ""
                }`}
              />
            </button>

            <ul
              className={`flex flex-col bg-[#089]/20 text-sm overflow-hidden transition-all duration-300 ${
                openSubs[item.label] ? "max-h-[1000px] py-2" : "max-h-0"
              }`}
            >
              {item.children.map((child) => (
                <li key={child.label}>
                  <button
                    onClick={() => handleItemClick(child)}
                    className="block w-full text-start px-8 py-1"
                  >
                    {child.label}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li
            key={item.label}
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </li>
        )
      )}
    </ul>
  );
}

/* ---------- Desktop menu component ---------- */
function DesktopMenu({
  items,
  openModal,
}: {
  items: MenuItem[];
  openModal: () => void;
}) {
  const renderItem = (it: MenuItem) =>
    it.children ? (
      <li key={it.label} className="relative group cursor-pointer">
        {it.label}
        <ul className="absolute z-10 w-[250%] bg-white rounded-md p-4 group-hover:flex flex-col gap-2 text-sm hidden">
          {it.children.map(renderItem)}
        </ul>
      </li>
    ) : it.action === "modal" ? (
      <li key={it.label} className="cursor-pointer" onClick={openModal}>
        {it.label}
      </li>
    ) : it.external ? (
      <li key={it.label}>
        <a
          href={it.path}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {it.label}
        </a>
      </li>
    ) : (
      <li key={it.label}>
        <Link href={it.path!}>{it.label}</Link>
      </li>
    );

  return (
    <ul className="flex flex-row  justify-end sm:gap-3 sm:text-[13px] md:text-sm lg:text-base md:gap-4 lg:gap-8">
      {items.map(renderItem)}
    </ul>
  );
}

/* ==================== Navbar ==================== */
function Navbar() {
  /* -------- recoil / router -------- */
  const state = useRecoilValue(globalState);
  const setGlobalState = useSetRecoilState(globalState);
  const [section, setSection] = useRecoilState(ownerSectionAtom);
  const [modalState, setModalState] = useRecoilState(commissionModalState);
  const router = useRouter();

  /* -------- local states -------- */
  const [username, setUsername] = useState(Strings.loginOrSignup);
  const [isUserValid, setIsUserValid] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

  const documentService = useRef(new DocumentService());
  const [docsType1, setDocsType1] = useState<Document[]>([]);
  const [docsType2, setDocsType2] = useState<Document[]>([]);

  const toggleSub = (l: string) =>
    setOpenSubs((p) => ({ ...p, [l]: !p[l] }));
  const closeDrawer = () => setDrawerOpen(false);
  const openModal = () =>
    setModalState({ ...modalState, showCommissionModal: true });

  /* -------- effects -------- */
  useEffect(() => {
    state.loggedIn
      ? (setUsername(state.name), setIsUserValid(true))
      : (setUsername(Strings.loginOrSignup), setIsUserValid(false));

    documentService.current.getDocument().then((arr) => {
      setDocsType1(arr.filter((d) => d.type === 1));
      setDocsType2(arr.filter((d) => d.type === 2));
    });

    const onScroll = () => setScrolled(window.scrollY > 500);
    const onResize = () => window.innerWidth > 639 && setDrawerOpen(false);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    /* جلوگیری از اسکرول پشت دراور */
    document.body.style.overflow = drawerOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [drawerOpen, state]);

  /* -------- sign out -------- */
  const logout = () => {
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

  /* -------- unified nav data -------- */
  const navMenu: MenuItem[] = [
    { label: Strings.home, path: "/" },
    { label: Strings.searchEstates, path: "/search-estate" },
    {
      label: Strings.inquiries,
      children: [
        {
          label: "استعلام سند",
          path: "https://my.ssaa.ir/portal/estate/originality-document/",
          external: true,
        },
        {
          label: "استعلام وکالت‌نامه",
          path: "https://my.ssaa.ir/portal/ssar/originality-document/",
          external: true,
        },
        {
          label: "استعلام چک صیادی",
          path: "https://cbi.ir/simplelist/19689.aspx",
          external: true,
        },
        {
          label: "استعلام موقعیت ملک",
          path: "https://geoplaner.com",
          external: true,
        },
        {
          label: "استعلام کد رهگیری",
          path: "https://www.iranamlaak.ir/Forms/Contracts/FilterContractsByContractSide.aspx",
          external: true,
        },
        {
          label: "استعلام پروانه (کد ملی)",
          path: "https://iranianasnaf.ir/forms/public/nationalcodeinquiry/default.aspx",
          external: true,
        },
        {
          label: "استعلام پروانه (کد پستی)",
          path: "https://iranianasnaf.ir/forms/public/postalcodeinquiry/default.aspx",
          external: true,
        },
      ],
    },
    {
      label: Strings.amlaklaw,
      children: docsType1.map((d) => ({
        label: d.title,
        path: `https://ssja.ir/api/getdocument/${d.path}`,
        external: true,
      })),
    },
    {
      label: Strings.contractSamples,
      children: docsType2.map((d) => ({
        label: d.title,
        path: `https://ssja.ir/api/getdocument/${d.path}`,
        external: true,
      })),
    },
    { label: Strings.laws, path: "/laws" },
    { label: Strings.commissionCalculation, action: "modal" },
  ];

  /* -------- styles -------- */
  const bgTopNavbar = "bg-[#0ba]";

  /* ================= render ================= */
  return (
    <div className="w-full  select-none">
      <CommissionModal />

      {/* ---------- TOP BAR ---------- */}
      <div
        className={`${scrolled && "fixed w-full"} sm:static w-full h-24 text-white ${bgTopNavbar} z-10`}
      >
        <div className="container flex flex-row justify-between items-center  h-full">
          {/* همبرگر موبایل */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="sm:hidden flex items-center"
            aria-label="open menu"
          >
            <IoIcon.IoIosMenu className="w-8 h-8" />
          </button>

          {/* اوورلی نیمه‌شفاف (فقط موبایل) */}
          <div
            onClick={closeDrawer}
            className={`fixed inset-0 sm:hidden ${
              drawerOpen ? "block" : "hidden"
            } bg-black/40 z-20`}
          />

          {/* ---------- DRAWER ---------- */}
          <aside
            className={`fixed top-0 bottom-0 right-0 w-64 bg-[#0ba] z-30 transition-transform duration-500 ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* دکمهٔ بستن */}
            <div className="flex justify-end p-2">
              <button onClick={closeDrawer} aria-label="close menu">
                <IoIcon.IoMdCloseCircle className="w-10 h-10" />
              </button>
            </div>

            {/* منوی موبایل */}
            <MobileMenu
              items={navMenu}
              openSubs={openSubs}
              toggleSub={toggleSub}
              closeDrawer={closeDrawer}
              openModal={openModal}
              router={router}
            />

            {/* لوگو و شبکه‌های اجتماعی (همان قبلی) */}
            <div className="mt-auto flex flex-col items-center gap-4 pb-4">
              <Image src="/image/logo/logo2.png" width={40} height={40} alt="logo" />
              <span className="font-['nastaliq'] text-xl">{Strings.sajaSystem}</span>
              <div className="flex flex-row gap-2">
                <Link href="t.me/samane_ssja">
                  <Image src="/icon/telegram.png" width={24} height={24} alt="telegram" />
                </Link>
                <Link href="instagram.com/ssja.ir">
                  <Image src="/icon/instagram.png" width={24} height={24} alt="instagram" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ---------- لوگو دسکتاپ ---------- */}
          <div className="hidden sm:flex  justify-center items-center gap-2 h-full px-2">
            <Image src="/image/logo/logo2.png" width={50} height={50} alt="logo" />
            <span className="font-['nastaliq'] text-2xl">{Strings.sajaSystem}</span>
          </div>

          {/* ---------- پروفایل/ورود ---------- */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => !state.loggedIn && router.push("/login")}
              className="flex items-center gap-2"
            >
              <BiIcon.BiUser className="w-5 h-5" />
              <span>{username}</span>
            </button>

            {isUserValid && (
              <ul className="absolute right-0 top-full w-36 bg-white text-gray-700 rounded-md shadow-md hidden group-hover:block">
                <li
                  className="py-2 flex gap-2 cursor-pointer px-4 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard")}
                >
                  <GoIcon.GoDashboard className="w-5 h-5" />
                  داشبورد
                </li>
                <li
                  className="py-2 flex gap-2 cursor-pointer px-4 hover:bg-gray-100"
                  onClick={logout}
                >
                  <MdIcon.MdOutlineExitToApp className="w-5 h-5" />
                  خروج
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ---------- DESKTOP NAV ---------- */}
      <nav
        className={`hidden sm:flex items-start justify-start z-50 transition-all duration-300 ${
          scrolled
            ? "fixed top-0 w-full h-16 bg-white text-gray-600 shadow-md"
            : "container mt-4 h-16 bg-[#f6f6f6] text-gray-600"
        }`}
      >
        <DesktopMenu items={navMenu} openModal={openModal} />
      </nav>
    </div>
  );
}

export default Navbar;
