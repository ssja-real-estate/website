import React, { FC, useEffect, useState } from "react";
import Strings from "../../../../../../data/strings";
import * as IoIcon from "react-icons/io";
import NewField from "./NewField";
const Accordion: FC<{ children: JSX.Element; title: string }> = (props) => {
  const [isShowBody, setIsShowBody] = useState(false);

  useEffect(() => {}, [isShowBody]);
  console.log(isShowBody);

  return (
    <>
      <div
        onClick={() => setIsShowBody((prev) => !prev)}
        className={`transition-all duration-200 h-82 w-full flex flex-col  mt-3 p-3 ${
          isShowBody ? "rounded-tl-xl rounded-tr-xl myBorder" : "rounded-xl"
        }  cursor-pointer border select-none hover:myBorderHover`}
      >
        <div className="flex flex-row items-center gap-3">
          <span className="ms-3">{props.title}</span>
          <IoIcon.IoIosArrowDown
            className={`transition-all duration-200 ${
              isShowBody ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>
      <div
        className={`px-2 py-3 transition-all duration-200 ${
          isShowBody
            ? "opacity-100 border-r border-b border-l"
            : "h-0 opacity-0"
        }`}
      >
        {/* <NewField /> */}
        {props.children}
      </div>
    </>
  );
};

export default Accordion;
