import { FC, useState } from "react";
import * as HiIcon from "react-icons/hi";

const MobileSideBar: FC<{
  dataSidebar: {
    id: number;
    title: string;
    icon: JSX.Element;
    onClickHandler: () => void;
  }[];
  index: number;
}> = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="w-full">
      <HiIcon.HiMenuAlt2
        onClick={() => setShowMenu((prev) => !prev)}
        className="text-2xl text-dark-blue mb-1"
      />
      {showMenu && (
        <div className="flex flex-col gap-4 w-full text-dark-blue pr-3">
          {props.dataSidebar.map((data) => (
            <div
              onClick={data.onClickHandler}
              key={data.id}
              className="flex gap-2 border rounded-xl px-2 py-2"
            >
              {data.icon}
              <span
                className={`${
                  data.id === props.index
                    ? "no-underline text-dark-blue font-bold"
                    : "text-[#a6a6a6] underline"
                }`}
              >
                {data.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSideBar;
