import * as MdIcon from "react-icons/md";

const Sidebar: React.FC<{
  dataSidebar: {
    id: number;
    title: string;
    icon: JSX.Element;
    onClickHandler: () => void;
  }[];
  index: number;
}> = (props) => {
  return (
    <div className="px-4 h-full flex flex-col justify-between">
      <div className="">
        <ul className="flex flex-col gap-4">
          {props.dataSidebar.map((datObj) => (
            <li
              onClick={datObj.onClickHandler}
              key={datObj.id}
              className="flex flex-row items-center gap-2 py-1 pr-4 cursor-pointer group"
            >
              {datObj.icon}
              <span
                className={`${
                  props.index === datObj.id
                    ? "no-underline text-dark-blue font-bold"
                    : "text-[#a6a6a6] underline"
                } group-hover:no-underline group-hover:text-[#2c3e50] transition-all duration-300`}
              >
                {datObj.title}
              </span>
            </li>
          ))}
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
