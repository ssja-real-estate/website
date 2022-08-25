import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";

type Option = Readonly<{
  id: number;
  city: string;
  state: string;
}>;
type SingleSelectDemoProps = Readonly<{
  isDisabled: boolean;
}>;

const _cityOptions: Option[] = [
  { id: 1, city: "Austin", state: "TX" },
  { id: 2, city: "Denver", state: "CO" },
  { id: 3, city: "Chicago", state: "IL" },
  { id: 4, city: "Phoenix", state: "AZ" },
  { id: 5, city: "Houston", state: "TX" },
];
const SearchEstate: NextPage = () => {
  const [lngvalue, setLng] = useState<number>(51.61313446084159);
  const [latvalue, setLnt] = useState<number>(35.431608468041475);

  return (
    <div className="">
      <div className="mt-0 sm:mt-0 h-screen">
        <div className="flex flex-row h-screen">
          {/* <SsjaMap lng={lngvalue} lat={latvalue} /> */}
          <SsjaMapTest lng={lngvalue} lat={latvalue} isDragable={false} />
        </div>

        <SidebarMap />
      </div>
    </div>
  );
};

export default SearchEstate;
