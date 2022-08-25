import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import * as AiIcon from "react-icons/ai";
import * as BiIcon from "react-icons/bi";
import SingleEstateSlider from "../../components/estate/SingleEstateSlider";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
const Property: NextPage = () => {
  const router = useRouter();
  console.log(router.query);

  return (
    <div className="container mb-16">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 ">
        <div className="order-2">
          <h2 className="font-bold text-[#2c3e50] text-lg">مشخصات</h2>
          <div className="mt-3 items-center">
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-[#2c3e50] text-sm">
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                گاراژ
              </li>
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                دو خواب
              </li>
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                سرویس بهداشتی 2 سرویس
              </li>
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                حمام 2
              </li>
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                مساحت 350 متر مربع
              </li>
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                آشپزخانه
              </li>
              <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
                هال
              </li>
            </ul>
          </div>
        </div>
        <div className="">
          <SingleEstateSlider />
        </div>
      </div>
      <div className="h-64 mt-14">
        <h2 className="text-[#2c3e50] font-bold text-lg my-2">نقشه ملک</h2>
        <SsjaMapTest lat={35.4316} lng={51.613134} isDragable={false} />
      </div>
    </div>
  );
};

export default Property;
