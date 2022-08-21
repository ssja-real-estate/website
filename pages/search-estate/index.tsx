import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import SelectInput from "../../components/formcomponent/SelectInput";
import MortgageRentSale from "../../components/home/mortgage-rent-sale/MortgageRentSale";
import SidebarMap from "../../components/map-component/SidebarMap";

import SsjaMap from "../../components/map-component/SsjaMap";
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

  const lngRef = useRef<HTMLInputElement>(null);
  const latRef = useRef<HTMLInputElement>(null);

  const setCordinateHandler = () => {
    console.log(lngRef.current?.value);

    if (lngRef !== null && latRef !== null) {
      setLng(Number(lngRef.current?.value));
      setLnt(Number(latRef.current?.value));
    }
  };

  return (
    <div className="">
      <div className="mt-0 sm:mt-0 h-screen">
        <div className="flex flex-row h-screen">
          {/* <SsjaMap lng={lngvalue} lat={latvalue} /> */}
          <SsjaMapTest lng={lngvalue} lat={latvalue} />
        </div>
        {/* <div
          ref={ref}
          className="container relative w-full rounded-2xl  bg-white z-10 -top-[33%] py-4 px-7 shadow-2xl"
        >
          <div className="flex flex-col">
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor="">استان</label>
                  <select className="selectbox" id="province" defaultValue="1">
                    <option disabled className="accent-gray-900 py-2" value="1">
                      انتخاب کنید
                    </option>
                    <option className="accent-gray-900" value="2">
                      آذربایجان شرقی
                    </option>
                    <option className="accent-gray-900" value="3">
                      کردستان
                    </option>
                  </select>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor="">استان</label>
                  <select className="selectbox" id="province" defaultValue="1">
                    <option disabled className="accent-gray-900 py-2" value="1">
                      انتخاب کنید
                    </option>
                    <option className="accent-gray-900" value="2">
                      آذربایجان شرقی
                    </option>
                    <option className="accent-gray-900" value="3">
                      کردستان
                    </option>
                  </select>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor="">استان</label>
                  <select className="selectbox" id="province" defaultValue="1">
                    <option disabled className="accent-gray-900 py-2" value="1">
                      انتخاب کنید
                    </option>
                    <option className="accent-gray-900" value="2">
                      آذربایجان شرقی
                    </option>
                    <option className="accent-gray-900" value="3">
                      کردستان
                    </option>
                  </select>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor="">استان</label>
                  <select className="selectbox" id="province" defaultValue="1">
                    <option disabled className="accent-gray-900 py-2" value="1">
                      انتخاب کنید
                    </option>
                    <option className="accent-gray-900" value="2">
                      آذربایجان شرقی
                    </option>
                    <option className="accent-gray-900" value="3">
                      کردستان
                    </option>
                  </select>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor="">استان</label>
                  <select className="selectbox" id="province" defaultValue="1">
                    <option disabled className="accent-gray-900 py-2" value="1">
                      انتخاب کنید
                    </option>
                    <option className="accent-gray-900" value="2">
                      آذربایجان شرقی
                    </option>
                    <option className="accent-gray-900" value="3">
                      کردستان
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="md:flex-1">
              <div className=""></div>
            </div>
          </div>
        </div> */}
        <SidebarMap />
      </div>
    </div>
  );
};

export default SearchEstate;
