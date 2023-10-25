import { NextPage } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { globalState } from "../../global/states/globalStates";
import { useRouter } from "next/router";
import * as GrIcon from "react-icons/gr";
import * as AiIcon from "react-icons/ai";
import * as CgIcon from "react-icons/cg";

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
    // if (state.role === 3) {
    //   router.push("/login");
    // } else if (state.role === 1) {
    //   setLoaded(true);
    // }
    isShowMenuInMobileDevice
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "");
  });

  const closeOverlayModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log(e.currentTarget);
    console.log(ref.current);

    if (ref.current === e.currentTarget) {
      setIsShowMobileInMobileDevice(false);
    }
  };

  // if (!loaded) {
  //   return <div className=""></div>;
  // }
  return (
    <div className="">
      <div className="mt-0 sm:mt-0 h-screen">
        <div className="flex flex-row h-full">
          <div className="hidden md:block">
            <SidebarMap
              setCore={setCordinate}
              onSetEstate={setEstate}
              width="72"
            />
          </div>
          {/* <SsjaMap lng={lngvalue} lat={latvalue} /> */}
          <div className="relative h-full w-full rounded-lg ">
            
            
          
              <div className="  h-1/2 w-full p-2">
              <SsjaMapTest cordinate={cordinate} isDragable={false} />
              </div>
              
               
                 <div className=" flex flex-col w-full  ">
               

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
    </div>
  );
};

export default SearchEstate;
