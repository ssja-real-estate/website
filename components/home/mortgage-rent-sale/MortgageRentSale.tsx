import React, { useState } from "react";
import Strings from "../../../data/strings";
import NewViewHouses from "../view-houses/NewViewHouses";
import ViweHouses from "../view-houses/ViweHouses";

function MortgageRentSale() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabData: string[] = [Strings.mortgage, Strings.rent, Strings.sale];
  const indexHandler = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <>
      <div className="container flex flex-row justify-center items-center gap-10 sm:gap-20 pt-20 pb-10 text-[#2c3e50]">
        {tabData.map((data: string, index: number) => (
          <div
            onClick={() => setActiveIndex(index)}
            key={index}
            className={`${
              activeIndex === index
                ? "border-[#2c3e50]"
                : "border-none text-[#b5b5b5]"
            } text-lg border-b-2  py-1 cursor-pointer`}
          >
            {data}
          </div>
        ))}
      </div>
      {/* <ViweHouses /> */}
      <NewViewHouses />
    </>
  );
}

export default MortgageRentSale;
