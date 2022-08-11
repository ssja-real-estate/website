import React from "react";
import Profile from "../../components/profile/Profile";
import Sidebar from "../../components/sidebar/Sidebar";

const dashboard: React.FC<{}> = (props) => {
  return (
    <div className="container">
      <h2 className="text-center text-[#2c3e50] text-[30px] font-bold mb-10">
        داشبورد
      </h2>
      <div className="flex flex-row mb-10 gap-5">
        <div className="hidden md:block pt-8 pb-8 bg-white w-52">
          <Sidebar />
        </div>
        <div className="bg-white pt-8 pb-8 px-10 w-[100%]">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default dashboard;
