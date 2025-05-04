import { NextPage } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { globalState } from "../../global/states/globalStates";
import { useRouter } from "next/router";

import { Estate } from "../../global/types/Estate";
import NewViewHouses from "../../components/home/view-houses/NewViewHouses";
const SearchEstate: NextPage = () => {
  const [toggleShowMapAndList, setToggleShowMapAndList] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [isShowMenuInMobileDevice, setIsShowMobileInMobileDevice] =
    useState(false);
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const [fetchEsteate, setEstate] = useState<Estate[]>();
  const state = useRecoilValue(globalState);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
   
    isShowMenuInMobileDevice
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "");
  });

  const closeOverlayModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
  
    if (ref.current === e.currentTarget) {
      setIsShowMobileInMobileDevice(false);
    }
  };

 
  return (
    <>
      <div className=" mt-0 sm:mt-0">
        <div className="flex flex-row ">
          <div className="hidden md:block">
            <SidebarMap
              setCore={setCordinate}
              onSetEstate={setEstate}
              width="72"
            />
          </div>
                 <div className="   flex-col w-full rounded-lg ">
            
            
          
              <div className="flex  h-[250px]">
              <SsjaMapTest cordinate={cordinate} isDragable={false} />
              </div>
              
               
               <div className=" grow  p-6">
               

                {fetchEsteate === undefined ? (
                  <div className="alertBox">جستجویی انجام نشده است</div>
                ) : (
                  <NewViewHouses allestates={fetchEsteate} />
                )}
           
           </div>
               
          </div>
        </div>
      </div>
      {isShowMenuInMobileDevice && (
        <div className="flex md:hidden justify-center items-center">
          <div
            onClick={closeOverlayModal}
            ref={ref}
            className="fixed top-0 w-full h-full bg-black/60 z-30 flex items-center justify-center"
          ></div>
          <div className="fixed top-0 bottom-2  mt-4 mb-4 z-30">
            <SidebarMap
              setCore={setCordinate}
              onSetEstate={setEstate}
              width="72"
              closeModalHandler={setIsShowMobileInMobileDevice}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchEstate;
