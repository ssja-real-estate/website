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
  const [toggleShowMapAndList, setToggleShowMapAndList] = useState(false);
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
            <div className="absolute border-[2px] w-12 h-12 flex items-center justify-center  bg-white z-20 top-2 right-2 text-[#2c3e50] rounded-lg shadow-md">
              <button
                onClick={() => setToggleShowMapAndList((prev) => !prev)}
                className="shadow-2xl py-1 px-1 text-sm"
              >
                {!toggleShowMapAndList && <CgIcon.CgList className="w-8 h-8" />}
                {toggleShowMapAndList && <GrIcon.GrMap className="w-6 h-6" />}
                {/* <span>فهرست</span> */}
              </button>
            </div>
            <div className="absolute  md:hidden border-[2px] h-12 flex items-center justify-center  bg-white z-20  top-2 right-16 text-[#2c3e50] rounded-lg shadow-md">
              <button
                onClick={() => setIsShowMobileInMobileDevice(true)}
                className="flex flex-row items-center justify-center gap-1 shadow-2xl py-1 px-2 text-sm"
              >
                <AiIcon.AiOutlineSearch className="w-6 h-6" />
                {/* <span className="text-lg">جستجو</span> */}
              </button>
            </div>
            {!toggleShowMapAndList ? (
              <SsjaMapTest cordinate={cordinate} isDragable={false} />
            ) : (
              <div className="z-0 w-full h-full  overflow-y-auto MyScroll">
                {/* {fetchEsteate?.map((estate) => (
                  <div key={estate.id} className="">
                    {estate.city.name}
                  </div>
                ))} */}

                {fetchEsteate === undefined ? (
                  <div className="alertBox">جستجویی انجام نشده است</div>
                ) : (
                  <NewViewHouses allestates={fetchEsteate} />
                )}
              </div>
            )}
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
