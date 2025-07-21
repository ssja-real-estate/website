// import { NextPage } from "next";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useRecoilValue } from "recoil";

// import SsjaMapTest from "../../components/map-component/SsjaMapTest";
// import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
// import { globalState } from "../../global/states/globalStates";
// import { useRouter } from "next/router";
// import * as AiIcon from "react-icons/ai";


// import { Estate } from "../../global/types/Estate";
// import NewViewHouses from "../../components/home/view-houses/NewViewHouses";
// import AddEstateSidebar from "../../components/AddEstate/AddEstateSideBar";
// const AddEstate: NextPage = () => {
//   const [toggleShowMapAndList, setToggleShowMapAndList] = useState(false);
//   const [loaded, setLoaded] = useState(false);
//   const [isShowMenuInMobileDevice, setIsShowMobileInMobileDevice] =
//     useState(false);
//   const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
//   const [fetchEsteate, setEstate] = useState<Estate[]>();
//   const state = useRecoilValue(globalState);
//   const router = useRouter();
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // if (state.role === 3) {
//     //   router.push("/login");
//     // } else if (state.role === 1) {
//     //   setLoaded(true);
//     // }
//     isShowMenuInMobileDevice
//       ? (document.body.style.overflow = "hidden")
//       : (document.body.style.overflow = "");
//   });

//   const closeOverlayModal = (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>
//   ) => {
//     console.log(e.currentTarget);
//     console.log(ref.current);

//     if (ref.current === e.currentTarget) {
//       setIsShowMobileInMobileDevice(false);
//     }
//   };

//   // if (!loaded) {
//   //   return <div className=""></div>;
//   // }
//   return (
//     <div className="">
//       <div className="mt-0 sm:mt-0 h-screen">
//         <div className="flex flex-row h-full">
//           <div className="hidden md:block">
//             <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
//           </div>
//           {/* <SsjaMap lng={lngvalue} lat={latvalue} /> */}
//           <div className="relative h-full w-full rounded-lg ">
//             <div className="absolute  md:hidden border-[2px] h-12 flex items-center justify-center  bg-white z-20  top-2 right-3 text-[#2c3e50] rounded-lg shadow-md">
//               <button
//                 onClick={() => setIsShowMobileInMobileDevice(true)}
//                 className="flex flex-row items-center justify-center gap-1 shadow-2xl py-1 px-2 text-sm"
//               >
//                 <AiIcon.AiOutlineSearch className="w-6 h-6" />
//                 {/* <span className="text-lg">جستجو</span> */}
//               </button>
//             </div>
//             <SsjaMapTest cordinate={cordinate} isDragable={false} />
//           </div>
//         </div>
//       </div>
//       {isShowMenuInMobileDevice && (
//         <div className="flex md:hidden justify-center items-center">
//           <div
//             onClick={closeOverlayModal}
//             ref={ref}
//             className="fixed top-0 w-full h-full bg-black/60 z-30 flex items-center justify-center"
//           ></div>
//           <div className="fixed top-0 bottom-2  mt-4 mb-4 z-30">
//             <AddEstateSidebar
//               setCore={setCordinate}
//               onSetEstate={setEstate}
//               width="72"
//               closeModalHandler={setIsShowMobileInMobileDevice}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddEstate;


import { NextPage } from "next";
import React, { useEffect, useState } from "react"; // useRef دیگر لازم نیست
import { useRecoilValue } from "recoil";

import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { globalState } from "../../global/states/globalStates";
import { useRouter } from "next/router";
// import * as AiIcon from "react-icons/ai"; // دیگر لازم نیست چون دکمه جستجوی موبایل حذف می‌شود

import { Estate } from "../../global/types/Estate"; // اگر در این کامپوننت استفاده می‌شود بماند
// import NewViewHouses from "../../components/home/view-houses/NewViewHouses"; // در این صفحه استفاده نشده، می‌توانید حذف کنید
import AddEstateSidebar from "../../components/AddEstate/AddEstateSideBar";
import SidebarMap from "../../components/map-component/SidebarMap";

const AddEstate: NextPage = () => {
  // این stateها اگر جای دیگری استفاده نمی‌شوند، می‌توانند بررسی یا حذف شوند:
  const [toggleShowMapAndList, setToggleShowMapAndList] = useState(false);
  const [loaded, setLoaded] = useState(false); // اگر منطق احراز هویت که کامنت شده فعال شود، این مهم است
  const [fetchEsteate, setEstate] = useState<Estate[]>(); // به نظر می‌رسد این برای نمایش املاک است، شاید در صفحه "افزودن ملک" لازم نباشد

  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const state = useRecoilValue(globalState); // برای منطق احراز هویت (کامنت شده)
  const router = useRouter(); // برای منطق احراز هویت (کامنت شده)

  useEffect(() => {
    // نمونه منطق احراز هویت (در صورت نیاز از کامنت خارج کنید و تکمیل کنید)
    // if (state.role === "some_role_that_cannot_add_estate") { // state.role را با مقدار مناسب چک کنید
    //   router.push("/login"); // یا هر مسیر دیگری
    // } else {
    //   setLoaded(true);
    // }

    // منطق مربوط به document.body.style.overflow حذف شد چون مودال موبایل حذف شده است.
  }, [state, router]); // وابستگی‌ها را بر اساس منطق داخل useEffect تنظیم کنید

  // if (!loaded && !(router.pathname === "/login" || router.pathname === "/signup")) { // اگر از loaded برای کنترل نمایش استفاده می‌کنید
  //   return <div className="flex justify-center items-center min-h-screen">درحال بارگذاری...</div>;
  // }

  return (
    <div className="h-screen flex flex-col">
      {" "}
      {/* کانتینر اصلی با ارتفاع کامل صفحه و چیدمان ستونی */}
      {/* Desktop View */}
      <div className="hidden md:flex flex-row flex-grow overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 p-4 overflow-y-auto">
         <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
        </div>
        {/* Desktop Map */}
        <div className="flex-1 h-full">
          <SsjaMapTest cordinate={cordinate} isDragable={true} />{" "}
          {/* isDragable روی true تنظیم شد برای صفحه افزودن ملک */}
        </div>
      </div>
      {/* Mobile View */}
      <div className="md:hidden flex flex-col h-full">
        {" "}
    
        <div className="h-[90vh] border-b border-gray-300">
          <SsjaMapTest cordinate={cordinate} isDragable={true} />{" "}
          {/* isDragable روی true تنظیم شد */}
        </div>
        {/* Mobile AddEstateSidebar (remaining 70% height, scrollable) */}
        <div className="flex-grow overflow-y-auto p-4">
          {" "}
          {/* flex-grow برای گرفتن فضای باقی‌مانده */}
          <AddEstateSidebar
            setCore={setCordinate}
             onSetEstate={setEstate} // اگر AddEstateSidebar از این استفاده می‌کند، آن را نگه دارید
            // prop های width و closeModalHandler دیگر لازم نیستند
          />
        </div>
      </div>
    </div>
  );
};

export default AddEstate;
