import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navbar/Navbar";
import { useRecoilValue } from "recoil";
import { globalState } from "../../global/states/globalStates";
import BottomNavigationBar from "../../components/buttonnavigation/buttonnavigationbar";

// ---- هوک ساده تشخیص موبایل بر اساس breakpoint Tailwind (md=768px) ----
function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // در SSR window نداریم؛ بنابراین فقط در کلاینت بررسی می‌کنیم
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check(); // اجرای اولیه
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

interface Props {
  children: JSX.Element;
}

const HeaderAndFooterLayout = ({ children }: Props) => {
  const state = useRecoilValue(globalState);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile(); // true زمانی‌که عرض < md

  // مسیرهایی که نیاز به لاگین دارند
  useEffect(() => {
    if (
      (router.route === "/dashboard" ||
        router.route === "/add-estate" ||
        router.route === "/edit-estate") &&
      !state.loggedIn
    ) {
      router.push("/login");
    } else {
      setLoaded(true);
    }
  }, [router.route, state.loggedIn]); // loaded را از وابستگی حذف کردیم

  if (!loaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        درحال بارگذاری...
      </div>
    );
  }

  // صفحات بدون Header/Footer
  if (router.pathname === "/login" || router.pathname === "/signup") {
    return (
      <div className="flex flex-col min-h-screen">
        <main>{children}</main>
      </div>
    );
  }

  // آیا روی خانه هستیم؟
  const isHome = router.pathname === "/";

  // در موبایل فقط وقتی خانه‌ایم هدر نمایش داده شود؛ در غیر این‌صورت مخفی
  // در دسکتاپ همیشه نمایش داده شود
  const mobileHeaderClass = isMobile
    ? isHome
      ? "block"
      : "hidden"
    : "block"; // دسکتاپ

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`flex-shrink-0 md:block ${mobileHeaderClass}`}>
        <Header>
          <Navbar />
        </Header>
      </header>

      <main className="flex-grow overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Footer فقط دسکتاپ */}
      <footer className="hidden md:flex relative flex-shrink-0">
        <Footer />
      </footer>

      {/* ناوبری پایین فقط موبایل (فرض بر این است که خود کامپوننت md:hidden دارد؛ در صورت نیاز اینجا اعمال کنید) */}
      <BottomNavigationBar />
    </div>
  );
};

export default HeaderAndFooterLayout;
