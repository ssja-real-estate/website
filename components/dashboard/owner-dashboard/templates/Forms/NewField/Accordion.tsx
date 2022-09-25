import React, { FC, useEffect, useState } from "react";
import Strings from "../../../../../../data/strings";
import * as IoIcon from "react-icons/io";
const Accordion: FC = () => {
  const [isShowBody, setIsShowBody] = useState(false);
  useEffect(() => {
    function changestate() {
      setIsShowBody((prev) => !prev);
    }
  }, [isShowBody]);
  console.log(isShowBody);

  return (
    <>
      <div
        onClick={(prev) => setIsShowBody(!prev)}
        className="h-82 w-full flex flex-col bg-red-600 mt-3 p-3 rounded-xl cursor-pointer"
      >
        <div className="flex flex-row items-center">
          <span className="ms-3">{Strings.newConditionalField}</span>
          <IoIcon.IoIosArrowDown />
        </div>
      </div>
      {isShowBody && <div className="">ddddddddd</div>}
    </>
  );
};

export default Accordion;
