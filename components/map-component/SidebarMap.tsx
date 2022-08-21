import React, { FC } from "react";
import * as FiIcon from "react-icons/fi";
const SidebarMap: FC = () => {
  return (
    <div className="relative w-56 md:w-80 h-screen bg-[rgba(44,62,80,.85)] z-20 -top-[100%] py-5 px-14 text-sm flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="province" className="text-white">
          استان
        </label>
        <select name="" id="province" defaultValue="1">
          <option value="1" disabled>
            انتخاب کنید
          </option>
          <option value="">آذربایجان غربی</option>
          <option value="">آذربایجان شرقی</option>
          <option value="">کردستان</option>
          <option value="">کرمانشاه</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="county" className="text-white">
          شهرستان
        </label>
        <select name="" id="county" defaultValue="1">
          <option value="1" disabled>
            انتخاب کنید
          </option>
          <option value="">مهاباد</option>
          <option value="">سنندج</option>
          <option value="">سقز</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="region" className="text-white">
          منطقه
        </label>
        <select name="" id="region" defaultValue="1">
          <option value="1" disabled>
            انتخاب کنید
          </option>
          <option value="">پشت تپ</option>
          <option value="">زمینهای شهرداری</option>
          <option value="">تپه قاضی</option>
        </select>
      </div>
      <div className="flex flex-col gap-1" defaultValue="1">
        <label htmlFor="request" className="text-white">
          نوع درخواست
        </label>
        <select name="" id="request" defaultValue="1">
          <option value="1" disabled>
            انتخاب کنید
          </option>
          <option value="">رهن</option>
          <option value="">اجاره</option>
          <option value="">فروش</option>
        </select>
      </div>
      <div className="flex flex-col gap-1" defaultValue="1">
        <label htmlFor="property" className="text-white">
          نوع ملک
        </label>
        <select name="" id="property" defaultValue="1">
          <option value="1" disabled>
            انتخاب کنید
          </option>
          <option value="">آپارتمان</option>
          <option value="">ویلایی</option>
          <option value="">باغ</option>
        </select>
      </div>
      <div className="flex flex-row">
        <button className="bg-[#f3bc65] h-10 px-3  border-b-4 border-b-[#d99221] hover:border-b-[#f3bc65] w-full font-bold text-[#222222]  active:border-b-0 active:border-t-4 active:border-t-[#d99221] mt-3">
          جستجو
        </button>
      </div>
      <button className="border border-white h-10 px-3 flex flex-row items-center justify-center text-white gap-2 transition-all duration-200 hover:shadow-lg active:pt-2">
        <FiIcon.FiFilter className="w-5 h-5" />
        <span>فیلتر پیشرفته</span>
      </button>
    </div>
  );
};

export default SidebarMap;
