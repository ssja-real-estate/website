import Link from "next/link";
import React from "react";
import * as GoIcon from "react-icons/go";
import * as MdIcon from "react-icons/md";
import * as FiIcon from "react-icons/fi";
const Sidebar: React.FC = () => {
  return (
    <div className="px-4 h-full flex flex-col justify-between">
      <div className="">
        <ul className="flex flex-col gap-4">
          <li className="flex flex-row items-center gap-2 py-1 pr-4 cursor-pointer group">
            <GoIcon.GoDashboard className="w-5 h-6 text-[#2c3e50]" />
            <span className="text-[#a6a6a6] underline group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300">
              داشبورد
            </span>
          </li>
          <li className="flex flex-row items-center gap-2 py-1 pr-4 cursor-pointer group">
            <MdIcon.MdOutlineRealEstateAgent className="w-5 h-6 text-[#2c3e50]" />
            <span className="text-[#a6a6a6] underline group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300">
              املاک من
            </span>
          </li>
          <li className="flex flex-row items-center gap-2 py-1 pr-4 cursor-pointer group">
            <FiIcon.FiUsers className="w-5 h-6 text-[#2c3e50]" />
            <span className="text-[#a6a6a6] underline group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300">
              کاربران
            </span>
          </li>
        </ul>
      </div>
      <div className="">
        <ul>
          <li className="flex flex-row items-center gap-2 py-1 pr-4 cursor-pointer group">
            <MdIcon.MdOutlineExitToApp className="w-5 h-6 text-[#2c3e50]" />
            <span className="text-[#a6a6a6] underline group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300">
              خروج
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
