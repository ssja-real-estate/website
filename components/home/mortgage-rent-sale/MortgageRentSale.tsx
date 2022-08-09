import React, { useState } from "react";
import allRealState from "../../../data/all-realEastate";
import RealEastate from "../../../data/models/real-estate";
import Strings from "../../../data/strings";
import NewViewHouses from "../view-houses/NewViewHouses";

function MortgageRentSale() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabData: string[] = [Strings.mortgage, Strings.rent, Strings.sale];
  const indexHandler = (index: number) => {
    setActiveIndex(index);
  };
  const allRealEsates: RealEastate[] = allRealState;
  return (
    <>
      <div className="container flex flex-row justify-center items-center gap-10 sm:gap-20 pt-20 pb-10 text-[#2c3e50]">
        {tabData.map((data: string, index: number) => (
          <div
            onClick={() => indexHandler(index)}
            key={index}
            className={`${
              activeIndex === index
                ? "border-[#2c3e50]"
                : "border-none text-[#b5b5b5]"
            } text-lg border-b-4  py-1 cursor-pointer`}
          >
            {data}
          </div>
        ))}
      </div>
      <NewViewHouses all={allRealEsates} />
    </>
  );
}

export default MortgageRentSale;
