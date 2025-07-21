import { NextPage } from "next";
import React, { useEffect, useState } from "react"; 
import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { Estate } from "../../global/types/Estate";
import NewViewHouses from "../../components/home/view-houses/NewViewHouses";
const SearchEstate: NextPage = () => {
 const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
 const [fetchEsteate, setEstate] = useState<Estate[]>();
  return (
    <>
      <div className="hidden md:flex flex-col h-screen">
       <div className="flex flex-row flex-grow overflow-hidden">
          {" "}
          <div className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
            <SidebarMap
              setCore={setCordinate}
              onSetEstate={setEstate}
              width="full" 
            />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-[400px] lg:h-[490px] flex-shrink-0 border-b border-gray-200">
              <SsjaMapTest cordinate={cordinate} isDragable={false} />
            </div>
        
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

      <div className="md:hidden flex flex-col h-screen">
        <div className="h-[55vh] flex-shrink-0">
          <SsjaMapTest cordinate={cordinate} isDragable={false} />
        </div>

        <div className="p-3 border-t border-b border-gray-200 overflow-y-auto max-h-[calc(45vh-4rem)] bg-gray-50 flex-shrink-0">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            فیلترهای جستجو
          </h3>
          <SidebarMap
            setCore={setCordinate}
            onSetEstate={setEstate}
            width="full" 
          />
        </div>

        <div className="flex-grow overflow-y-auto p-4 pb-20">
          {fetchEsteate === undefined ? (
            <div className="alertBox text-center p-4">
              جستجویی انجام نشده است
            </div>
          ) : fetchEsteate.length === 0 ? (
            <div className="alertBox text-center p-4">
             ملکی با مشخصات وارد شده موجود نیست. آیا مایلید در صورت موجود شدن به شما اطلاع داده شود ؟
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