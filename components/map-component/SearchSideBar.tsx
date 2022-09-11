import React, { FC, useState } from "react";
import * as IoIcon from "react-icons/io";
import SearchForm from "./SearchForm";

const SearchSideBar: FC = () => {
  const [isShowSearchideBar, setIsShowSearchSideBar] = useState(false);
  return (
    <>
      <div
        className={`absolute py-10 px-3 transition-all duration-300 right-0 h-full w-80 rounded-tr-2xl rounded-br-2xl bg-white/75 z-30 ${
          isShowSearchideBar ? "top-0" : "-top-[1000px]"
        }`}
      >
        <div className="flex flex-col space-y-2 overflow-hidden">
          <div className="flex flex-row items-center gap-3">
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
    </>
  );
};

export default SearchSideBar;
