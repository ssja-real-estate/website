// import { AppProps } from "next/app";
// import { useRouter } from "next/router";
// import React, { ComponentProps, useEffect, useState } from "react";
// import Footer from "../footer/Footer";
// import Header from "../header/Header";
// import Navbar from "../navbar/Navbar";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { globalState } from "../../global/states/globalStates";
// import { getRouteMatcher } from "next/dist/shared/lib/router/utils/route-matcher";

// interface Props {
//   children: JSX.Element;
// }

// const HeaderAndFooterLayout = ({ children }: Props) => {
//   const state = useRecoilValue(globalState);
//   const [loaded, setLoaded] = useState(false);
//   const router = useRouter();
//   useEffect(() => {
//     if (
//       (router.route === "/dashboard" ||
//         router.route === "/add-estate" ||
//         router.route === "/edit-estate") &&
//       !state.loggedIn
//     ) {
//       router.push("/login");
//     } else {
//       setLoaded(true);
//     }
//   }, [router, loaded, state]);
//   if (!loaded) {
//     return <div></div>;
//   }
//   if (router.pathname === "/login" || router.pathname === "/signup") {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <main>{children}</main>
//       </div>
//     );
//   }
//   return (
//     <div className="w-full h-full  ">
//       <header>
//         <Header>
//           <Navbar />
//         </Header>
//       </header>

//       <div className="shrink">{children}</div>

//       <footer className="flex relative ">
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default HeaderAndFooterLayout;

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"; // ComponentProps و getRouteMatcher استفاده نشده بودند
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navbar/Navbar";
import { useRecoilValue } from "recoil"; // useRecoilState استفاده نشده بود
import { globalState } from "../../global/states/globalStates";
import BottomNavigationBar from "../../components/buttonnavigation/buttonnavigationbar"; // مسیر را بررسی و در صورت نیاز اصلاح کنید

interface Props {
  children: JSX.Element;
}

const HeaderAndFooterLayout = ({ children }: Props) => {
  const state = useRecoilValue(globalState);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

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
  }, [router, loaded, state]); // اگر 'loaded' باعث اجرای مجدد ناخواسته می‌شود، می‌توانید آن را از وابستگی‌ها حذف کنید و فقط بر اساس router و state.loggedIn تصمیم بگیرید.

  if (!loaded) {
    // یک لودر بهتر یا اسکلتون می‌تواند اینجا نمایش داده شود
    return <div className="flex justify-center items-center min-h-screen">درحال بارگذاری...</div>;
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
      <header className="flex-shrink-0"> {/* جلوگیری از کوچک شدن header */}
        <Header>
          <Navbar />
        </Header>
      </header>

      {/* محتوای اصلی صفحه */}
      {/* pb-16 برای ایجاد فضا برای BottomNavigationBar در موبایل (با فرض ارتفاع 4rem یا h-16 برای آن) */}
      {/* md:pb-0 این پدینگ را در دسکتاپ حذف می‌کند */}
      <main className="flex-grow overflow-y-auto pb-16 md:pb-0"> {/* کلاس shrink شما با flex-grow جایگزین شد */}
        {children}
      </main>

      {/* Footer فقط در دسکتاپ (md و بالاتر) نمایش داده می‌شود */}
      <footer className="hidden md:flex relative flex-shrink-0"> {/* کلاس‌های جدید برای کنترل نمایش و جلوگیری از کوچک شدن */}
        <Footer />
      </footer>

      {/* BottomNavigationBar فقط در موبایل نمایش داده می‌شود */}
      {/* این کامپوننت باید خودش کلاس md:hidden را برای مخفی شدن در دسکتاپ داشته باشد */}
      <BottomNavigationBar />
    </div>
  );
};

export default HeaderAndFooterLayout;