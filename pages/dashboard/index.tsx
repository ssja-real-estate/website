import React, { useEffect, useState } from "react";
import Profile from "../../components/dashboard/profile/Profile";
import Sidebar from "../../components/dashboard/sidebar/Sidebar";
import * as GoIcon from "react-icons/go";
import * as FiIcon from "react-icons/fi";
import * as MdIcon from "react-icons/md";
import * as TbIcon from "react-icons/tb";
import { NextPage } from "next";
import AllEstateStatus from "../../components/dashboard/EstateStatus/AllEstateStatus";

enum dashboardContet {
  profile = 1,
  myEstate = 2,
  forms = 3,
  users = 4,
}
interface sidebarData {
  id: number;
  title: string;
  icon: JSX.Element;
  onClickHandler: () => void;
}
const Dashboard: NextPage<{ initial?: number }> = ({ initial = 1 }) => {
  const [index, setIndex] = useState<number>(initial);
  const [elementView, setElementView] = useState<JSX.Element>(<Profile />);
  const changeDashboardContent = (index: number) => {
    setIndex(index);
  };
  useEffect(() => {
    switch (index) {
      case dashboardContet.profile:
        setElementView(<Profile />);
        break;
      case dashboardContet.myEstate:
        setElementView(<AllEstateStatus />);
        break;
      case dashboardContet.forms:
        setElementView(<h2>قالب ها</h2>);
        break;
      case dashboardContet.users:
        setElementView(<h2>کاربران</h2>);
        break;
    }
  }, [index]);
  const sidebarMenu: sidebarData[] = [
    {
      id: 1,
      title: "داشبورد",
      icon: <GoIcon.GoDashboard className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        changeDashboardContent(dashboardContet.profile);
      },
    },
    {
      id: 2,
      title: "املاک من",
      icon: (
        <MdIcon.MdOutlineRealEstateAgent className="w-5 h-6 text-[#2c3e50]" />
      ),
      onClickHandler: () => {
        changeDashboardContent(dashboardContet.myEstate);
      },
    },
    {
      id: 3,
      title: "قالب ها",
      icon: <TbIcon.TbLayoutGridAdd className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        changeDashboardContent(dashboardContet.forms);
      },
    },
    {
      id: 4,
      title: "کاربران",
      icon: <FiIcon.FiUsers className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        changeDashboardContent(dashboardContet.users);
      },
    },
  ];

  return (
    <div className="container">
      <div className="flex flex-row mb-10 gap-5">
        <div className="hidden md:block pt-8 pb-8 bg-white w-52">
          <Sidebar dataSidebar={sidebarMenu} />
        </div>
        <div className="bg-white pt-8 pb-8 px-10 w-[100%]">{elementView}</div>
      </div>
    </div>
  );
};

export default Dashboard;
