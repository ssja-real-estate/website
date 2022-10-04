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
import { ownerSectionAtom } from "../owner-dashboard/OwnerDashboard";
import UsersSection from "./Users/UsersSection";
import TemplateList from "./templates/TemplateList";
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
// export const adminSectionAtom = atom({
//   key: "adminSidebarState",
//   default: "profile",
// });
const AdminDashboard: FC = () => {
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
      title: "قالب ها",
      icon: <TbIcon.TbLayoutGridAdd className="w-5 h-6 text-[#2c3e50]" />,
      onClickHandler: () => {
        setSection("templates");
      },
      sectionName: sectionName.templates,
    },
    {
      id: 4,
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

        {section === "profile" ? (
          <Profile />
        ) : section === "estateStatus" ? (
          <AllEstateStatus />
        ) : section === "users" ? (
          <div>
            <UsersSection />
          </div>
        ) : (
          section === "templates" && <TemplateList />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
