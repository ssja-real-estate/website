import React, { FC } from "react";

const ShimerAnimationEstateCard: FC = () => {
  return (
    <div className="animate-pulse bg-white relative  cursor-pointer transition-all duration-100 ease-in hover:shadow-lg hover:-translate-y-3">
      <div className="w-full h-64 z-10 bg-gray-200"></div>
      <div className="px-2 py-4 divide-y divide-dashed">
        <div className="">
          <h3 className="bg-gray-200  h-10 w-full"></h3>
          <p className=" bg-gray-200 w-full h-12"></p>
        </div>
        <div className=" ">
          <div className="">
            <div className="text-2xl font-bold bg-gray-200  h-10 w-full block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShimerAnimationEstateCard;
