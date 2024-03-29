import { FC } from "react";
import * as GoIcon from "react-icons/go";
import * as FiIcon from "react-icons/fi";
import * as MdIcon from "react-icons/md";
import * as TbIcon from "react-icons/tb";
import * as CgIcon from "react-icons/cg";
import Sidebar from "../sidebar/Sidebar";
import MobileSideBar from "../sidebar/MobileSideBar";
import AllEstateStatus from "../EstateStatus/AllEstateStatus";
import Profile from "../profile/Profile";
import { atom, useRecoilState } from "recoil";
import UnVerigyEstate from "../EstateStatus/UnVerigyEstate";
import RejectEstates from "../EstateStatus/RejectEstates";
import TemplateList from "./templates/TemplateList";
import UsersSection from "./Users/UsersSection";
import LawDashboard from "../add-law/law-dashboard";
import ImageDashboard from "../add-image/add-image";

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
  addlaws="add-law",
  addimage="image-slider"
}
export const ownerSectionAtom = atom({
  key: "ownerSidebarState",
  default: "profile",
});
const OwnerDashboard: FC = () => {
  const [section, setSection] = useRecoilState(ownerSectionAtom);

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
      icon: <CgIcon.CgSandClock className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("unVerifyEstate");
      },
      sectionName: sectionName.unVerifyEstate,
    },
    {
      id: 4,
      title: "املاک تأیید نشده",
      icon: <MdIcon.MdOutlineCancel className="w-5 h-6 text-[#2c3e50]" />,
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
     {
      id: 7,
      title: "قراردادها وقوانین",
      icon: <FiIcon.FiUploadCloud className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("add-law");
      },
      sectionName: sectionName.addlaws,
    },
    {
      id: 8,
      title: "تنظیمات اسلایدر",
      icon: <FiIcon.FiUploadCloud className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("image-slider");
      },
      sectionName: sectionName.addimage,
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
        {section === "profile" ? (
          <Profile />
        )
        :section ==="add-law" ? (<LawDashboard/>)
        :section==="image-slider" ? (<ImageDashboard/>)
        : section === "estateStatus" ? (
          <AllEstateStatus />
        ) : section === "unVerifyEstate" ? (
          <UnVerigyEstate />
        ) : section === "rejectEstate" ? (
          <RejectEstates />
        ) : section === "users" ? (
          <UsersSection />
        ) : (
          section === "templates" && <TemplateList />
        ) }
      </div>
    </div>
  );
};

export default OwnerDashboard;
