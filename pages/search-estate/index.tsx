import { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";

const SearchEstate: NextPage = () => {
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);

  return (
    <div className="">
      <div className="mt-0 sm:mt-0 h-screen">
        <div className="flex flex-row h-screen">
          {/* <SsjaMap lng={lngvalue} lat={latvalue} /> */}
          <SsjaMapTest cordinate={cordinate} isDragable={false} />
        </div>
        <SidebarMap setCore={setCordinate} />
      </div>
    </div>
  );
};

export default SearchEstate;
