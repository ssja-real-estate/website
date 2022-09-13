import { useRouter } from "next/router";
import * as MdIcon from "react-icons/md";
import { useRecoilValue } from "recoil";
import { ownerSectionAtom } from "../owner-dashboard/OwnerDashboard";

const Sidebar: React.FC<{
  dataSidebar: {
    id: number;
    title: string;
    icon: JSX.Element;
    onClickHandler: () => void;
    sectionName: string;
  }[];
}> = (props) => {
  const section = useRecoilValue(ownerSectionAtom);
  const router = useRouter();
  return (
    <div className="px-2 h-full flex flex-col justify-between">
      <div className="">
        <ul className="flex flex-col gap-4 text-sm w-full">
          {props.dataSidebar.map((datObj) => (
            <li
              onClick={datObj.onClickHandler}
              key={datObj.id}
              className="flex flex-row items-center gap-2 py-1 pr-4 cursor-pointer group"
            >
              {datObj.icon}
              <span
                className={`${
                  section === datObj.sectionName
                    ? "no-underline text-dark-blue font-bold"
                    : "text-[#a6a6a6] underline"
                } group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300`}
              >
                {datObj.title}
              </span>
            </li>
          ))}
          <li className="flex flex-row items-center justify-center gap-2 py-1  cursor-pointer group">
            <button
              onClick={() => router.push("/add-estate")}
              className="transition-all  text-sm rounded-full w-full  py-2 px-2 flex flex-row gap-2 justify-center items-center bg-[#d99221] text-white shadow-md hover:-translate-y-1 focus-within:translate-y-0"
            >
              <span>+</span>
              <span className="">اضافه کردن ملک</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="">
        <ul className="mt-4">
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
