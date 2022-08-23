import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import * as AiIcon from "react-icons/ai";
import * as BiIcon from "react-icons/bi";
import SingleEstateSlider from "../../components/estate/SingleEstateSlider";
const Property: NextPage = () => {
  const router = useRouter();
  console.log(router.query);

  return (
    <div className="container">
      <div className="">
        <h1 className="text-[#2c3e50] font-bold text-[30px]">
          خانه ویلایی تپه قاضی
        </h1>
        <h3 className="text-[#2c3e50] font-thin text-[20px]">
          تپه قاصی، ایستگاه 3، کوچه پنجم
        </h3>
      </div>
      <div className="h-[1px] my-3 bg-gray-300 w-full"></div>
      <div className="py-5">
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center justify-between">
          <div className="bg-white border py-4 border-[#d6d6d6] p-2 text-[#0ba] text-[30px] flex items-center justify-center gap-2">
            <span>{(2354654125).toLocaleString("fa-ir")}</span>
            <span className="text-sm">تومان</span>
          </div>
          <div className="flex flex-row gap-3">
            <button className="border-2 w-full sm:w-40  text-[#2c3e50]  border-[#2c3e50] flex items-center justify-center py-2 px-4 gap-1 hover:text-[#f3bc65] hover:border-[#f3bc65]">
              <span>مورد علاقه من</span>
              <AiIcon.AiFillStar />
            </button>
            <button className="border-2 w-full sm:w-40 text-[#2c3e50]  border-[#2c3e50] flex items-center justify-center py-2 px-4 gap-1 hover:text-[#f3bc65] hover:border-[#f3bc65]">
              <span>بروز رسانی </span>
              <BiIcon.BiRefresh className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="">1</div>
        <div className="">
          <SingleEstateSlider />
        </div>
      </div>
    </div>
  );
};

export default Property;
