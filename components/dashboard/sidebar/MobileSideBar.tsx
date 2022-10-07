import { useRouter } from "next/router";
import { FC, useState } from "react";
import * as HiIcon from "react-icons/hi";
import { useRecoilValue } from "recoil";
import { ownerSectionAtom } from "../owner-dashboard/OwnerDashboard";

const MobileSideBar: FC<{
  dataSidebar: {
    id: number;
    title: string;
    icon: JSX.Element;
    onClickHandler: () => void;
    sectionName: string;
  }[];
}> = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const section = useRecoilValue(ownerSectionAtom);
  const router = useRouter();
  return (
    <div className="w-full">
      <HiIcon.HiMenuAlt2
        onClick={() => setShowMenu((prev) => !prev)}
        className="text-2xl text-dark-blue mb-1 cursor-pointer"
      />
      {showMenu && (
        <div className="flex flex-col gap-4 w-full text-dark-blue pr-3 cursor-pointer">
          {props.dataSidebar.map((data) => (
            <div
              onClick={data.onClickHandler}
              key={data.id}
              className="flex gap-2 border rounded-xl px-2 py-2"
            >
              {data.icon}
              <span
                className={`${
                  section === data.sectionName
                    ? "no-underline text-dark-blue font-bold"
                    : "text-[#a6a6a6] underline"
                }`}
              >
                {data.title}
              </span>
            </div>
          ))}
          <div className="flex flex-row items-center justify-center gap-2 py-1  cursor-pointer group">
            <button
              onClick={() => router.push("/add-estate")}
              className="transition-all  text-sm rounded-full w-full  py-2 px-2 flex flex-row gap-2 justify-center items-center bg-[#d99221] text-white shadow-md hover:-translate-y-1 focus-within:translate-y-0"
            >
              <span>+</span>
              <span className="">اضافه کردن ملک</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSideBar;
