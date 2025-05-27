// import { NextPage } from "next";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useRecoilValue } from "recoil";
// import SidebarMap from "../../components/map-component/SidebarMap";
// import SsjaMapTest from "../../components/map-component/SsjaMapTest";
// import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
// import { globalState } from "../../global/states/globalStates";
// import { useRouter } from "next/router";

// import { Estate } from "../../global/types/Estate";
// import NewViewHouses from "../../components/home/view-houses/NewViewHouses";
// const SearchEstate: NextPage = () => {
//   const [toggleShowMapAndList, setToggleShowMapAndList] = useState(true);
//   const [loaded, setLoaded] = useState(false);
//   const [isShowMenuInMobileDevice, setIsShowMobileInMobileDevice] =
//     useState(false);
//   const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
//   const [fetchEsteate, setEstate] = useState<Estate[]>();
//   const state = useRecoilValue(globalState);
//   const router = useRouter();
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
   
//     isShowMenuInMobileDevice
//       ? (document.body.style.overflow = "hidden")
//       : (document.body.style.overflow = "");
//   });

//   const closeOverlayModal = (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>
//   ) => {
  
//     if (ref.current === e.currentTarget) {
//       setIsShowMobileInMobileDevice(false);
//     }
//   };

 
//   return (
//     <>
//       <div className=" mt-0 sm:mt-0">
//         <div className="flex flex-row ">
//           <div className="hidden md:block">
//             <SidebarMap
//               setCore={setCordinate}
//               onSetEstate={setEstate}
//               width="72"
//             />
//           </div>
//                  <div className="   flex-col w-full rounded-lg ">
            
            
          
//               <div className="flex  h-[490px]">
//               <SsjaMapTest cordinate={cordinate} isDragable={false} />
//               </div>
              
               
         
               
//           </div>
//         </div>
//               <div className=" grow  p-6">
               

//                 {fetchEsteate === undefined ? (
//                   <div className="alertBox">جستجویی انجام نشده است</div>
//                 ) : (
//                   <NewViewHouses allestates={fetchEsteate} />
//                 )}
           
//            </div>
//       </div>
//       {isShowMenuInMobileDevice && (
//         <div className="flex md:hidden justify-center items-center">
//           <div
//             onClick={closeOverlayModal}
//             ref={ref}
//             className="fixed top-0 w-full h-full bg-black/60 z-30 flex items-center justify-center"
//           ></div>
//           <div className="fixed top-0 bottom-2  mt-4 mb-4 z-30">
//             <SidebarMap
//               setCore={setCordinate}
//               onSetEstate={setEstate}
//               width="72"
//               closeModalHandler={setIsShowMobileInMobileDevice}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SearchEstate;
import { NextPage } from "next";
import React, { useEffect, useState } from "react"; // useRef, useRecoilValue, globalState, router دیگر لازم نیستند مگر اینکه جای دیگری استفاده شوند
import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { Estate } from "../../global/types/Estate";
import NewViewHouses from "../../components/home/view-houses/NewViewHouses";
import BottomNavigationBar from "../../components/buttonnavigation/buttonnavigationbar"; // مسیر را در صورت نیاز تنظیم کنید

const SearchEstate: NextPage = () => {
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const [fetchEsteate, setEstate] = useState<Estate[]>();

  // useEffect برای overflow body دیگر به شکل قبلی لازم نیست، چون سایدبار موبایل همیشه بخشی از جریان صفحه است.
  // اگر نیاز به مدیریت overflow برای کل صفحه در حالت‌های خاصی دارید، می‌توانید آن را حفظ کنید.

  return (
    <>
      {/* Desktop View Layout */}
      <div className="hidden md:flex flex-col h-screen">
        {" "}
        {/* h-screen برای اطمینان از ارتفاع کامل */}
        <div className="flex flex-row flex-grow overflow-hidden">
          {" "}
          {/* flex-grow و overflow-hidden برای مدیریت محتوا */}
          {/* Desktop Sidebar */}
          <div className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
            <SidebarMap
              setCore={setCordinate}
              onSetEstate={setEstate}
              width="full" // SidebarMap عرض والد خود را می‌گیرد
            />
          </div>

          {/* Desktop Main Content (Map + Results) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Desktop Map */}
            <div className="h-[400px] lg:h-[490px] flex-shrink-0 border-b border-gray-200">
              <SsjaMapTest cordinate={cordinate} isDragable={false} />
            </div>
            {/* Desktop Results */}
        
          </div>
        </div>
            <div className="flex-grow p-6 overflow-y-auto">
              {fetchEsteate === undefined ? (
                <div className="alertBox text-center p-4">
                  جستجویی انجام نشده است
                </div>
              ) : fetchEsteate.length === 0 ? (
                <div className="alertBox text-center p-4">
                  موردی با این مشخصات یافت نشد
                </div>
              ) : (
                <NewViewHouses allestates={fetchEsteate} />
              )}
            </div>
      </div>

      {/* Mobile View Layout */}
      <div className="md:hidden flex flex-col h-screen">
        {/* 1. Map (40% of viewport height) */}
        <div className="h-[30vh] flex-shrink-0">
          <SsjaMapTest cordinate={cordinate} isDragable={false} />
        </div>

        {/* 2. SidebarMap (Filters) - Scrollable */}
        <div className="p-3 border-t border-b border-gray-200 overflow-y-auto max-h-[calc(45vh-4rem)] bg-gray-50 flex-shrink-0">
          {/* max-h محاسبه شده تا فضای کافی برای لیست نتایج و نوار پایین بماند. 4rem ارتفاع تقریبی نوار پایین است. */}
          {/* شما می‌توانید این ارتفاع را تنظیم کنید. */}
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            فیلترهای جستجو
          </h3>
          <SidebarMap
            setCore={setCordinate}
            onSetEstate={setEstate}
            width="full" // SidebarMap عرض والد خود را می‌گیرد
            // closeModalHandler دیگر اینجا لازم نیست
          />
        </div>

        {/* 3. List of Search Results - Takes remaining space and scrolls */}
        {/* pb-16 برای ایجاد فاصله از نوار منوی پایینی (h-16) */}
        <div className="flex-grow overflow-y-auto p-4 pb-20">
          {fetchEsteate === undefined ? (
            <div className="alertBox text-center p-4">
              جستجویی انجام نشده است
            </div>
          ) : fetchEsteate.length === 0 ? (
            <div className="alertBox text-center p-4">
              موردی با این مشخصات یافت نشد
            </div>
          ) : (
            <NewViewHouses allestates={fetchEsteate} />
          )}
        </div>

 
      </div>
    </>
  );
};

export default SearchEstate;