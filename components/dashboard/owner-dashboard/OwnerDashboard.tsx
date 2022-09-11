import { FC, useEffect, useState } from "react";
import * as GoIcon from "react-icons/go";
import * as FiIcon from "react-icons/fi";
import * as MdIcon from "react-icons/md";
import * as TbIcon from "react-icons/tb";
import Sidebar from "../sidebar/Sidebar";
import MobileSideBar from "../sidebar/MobileSideBar";
import AllEstateStatus from "../EstateStatus/AllEstateStatus";
import Profile from "../profile/Profile";
import { atom, useRecoilState } from "recoil";
import UnVerigyEstate from "../EstateStatus/UnVerigyEstate";
import RejectEstates from "../EstateStatus/RejectEstates";
interface sidebarData {
  id: number;
  title: string;
  icon: JSX.Element;
  onClickHandler: () => void;
  sectionName: string;
}

enum sectionName {
  profile = "profile",
  estateStatus = "estateStatus",
  templates = "templates",
  unVerifyEstate = "unVerifyEstate",
  rejectEstate = "rejectEstate",
  users = "users",
}
export const ownerSectionAtom = atom({
  key: "ownerSidebarState",
  default: "profile",
});
const OwnerDashboard: FC = () => {
  const [section, setSection] = useRecoilState(ownerSectionAtom);
  const [index, setIndex] = useState<number>(0);
  //   const [elementView, setElementView] = useState<JSX.Element>(<Profile />);
  //   const changeDashboardContent = (index: number) => {
  //     setIndex(index);
  //   };
  //   useEffect(() => {
  //     switch (index) {
  //       case dashboardContet.profile:
  //         setElementView(<Profile />);
  //         setSection("profile");
  //         break;
  //       case dashboardContet.myEstate:
  //         setElementView(<AllEstateStatus />);
  //         setSection("estateStatus");
  //         break;
  //       case dashboardContet.forms:
  //         setElementView(<h2>قالب ها</h2>);
  //         setSection("templates");
  //         break;
  //       case dashboardContet.users:
  //         setElementView(<h2>کاربران</h2>);
  //         setSection("users");
  //         break;
  //     }
  //   }, [index]);
  const sidebarMenu: sidebarData[] = [
    {
      id: 1,
      title: "داشبورد",
      icon: <GoIcon.GoDashboard className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("profile");
      },
      sectionName: sectionName.profile,
    },
    {
      id: 2,
      title: "املاک من",
      icon: (
        <MdIcon.MdOutlineRealEstateAgent className="w-5 h-6 text-[#2c3e50]" />
      ),
      onClickHandler: () => {
        setSection("estateStatus");
      },
      sectionName: sectionName.estateStatus,
    },
    {
      id: 3,
      title: "املاک در انتظار تأیید",
      icon: (
        <MdIcon.MdOutlineRealEstateAgent className="w-5 h-6 text-[#2c3e50]" />
      ),
      onClickHandler: () => {
        setSection("unVerifyEstate");
      },
      sectionName: sectionName.unVerifyEstate,
    },
    {
      id: 4,
      title: "املاک تأیید نشده",
      icon: (
        <MdIcon.MdOutlineRealEstateAgent className="w-5 h-6 text-[#2c3e50]" />
      ),
      onClickHandler: () => {
        setSection("rejectEstate");
      },
      sectionName: sectionName.rejectEstate,
    },
    {
      id: 5,
      title: "قالب ها",
      icon: <TbIcon.TbLayoutGridAdd className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("templates");
      },
      sectionName: sectionName.templates,
    },
    {
      id: 6,
      title: "کاربران",
      icon: <FiIcon.FiUsers className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("users");
      },
      sectionName: sectionName.users,
    },
  ];
  return (
    <div className="flex flex-row mb-10 gap-5">
      <div className="hidden md:block pt-8 pb-8 bg-white w-56">
        <Sidebar dataSidebar={sidebarMenu} />
      </div>
      <div className="bg-white pt-8 pb-8 px-10 w-[100%]">
        <div className="block md:hidden w-full opacity-100 pb-8 bg-white ">
          <MobileSideBar dataSidebar={sidebarMenu} />
        </div>
        {/* {elementView} */}
        {section === "profile" ? (
          <Profile />
        ) : section === "estateStatus" ? (
          <AllEstateStatus />
        ) : section === "unVerifyEstate" ? (
          <UnVerigyEstate />
        ) : section === "rejectEstate" ? (
          <RejectEstates />
        ) : section === "users" ? (
          <div>کاربران</div>
        ) : (
          section === "templates" && <div className="">قالبها</div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
