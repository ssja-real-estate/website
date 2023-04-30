import React, { FC, useEffect, useRef, useState } from "react";
import * as BsIcon from "react-icons/bs";
import * as IoIcon from "react-icons/io5";
import * as CgIcon from "react-icons/cg";
import * as MdIcon from "react-icons/md";
import { EstateStatus } from "../../../global/types/Estate";
interface labelCard {
  estatStatus: EstateStatus;
}
const LabelStatusEstatecard: FC<labelCard> = (props) => {
  return (
    <div
      className={`absolute ${
        props.estatStatus === 1
          ? "bg-green-600"
          : props.estatStatus === 2
          ? "bg-gray-400"
          : props.estatStatus === 3 && "bg-red-800"
      } shadow-sm z-10 top-2 flex flex-row items-center justify-center gap-2 py-1 px-2 rounded-tl-2xl rounded-bl-2xl`}
    >
      {props.estatStatus === 1 ? (
        <IoIcon.IoCheckmarkCircleOutline className="text-white text-2xl" />
      ) : props.estatStatus === 2 ? (
        <CgIcon.CgSandClock className="text-white text-2xl" />
      ) : (
        props.estatStatus === 3 && (
          <MdIcon.MdOutlineCancel className="text-white text-2xl" />
        )
      )}
      {props.estatStatus === 1 ? (
        <span className="text-white text-sm">تأیید شده</span>
      ) : props.estatStatus === 2 ? (
        <span className="text-white  text-sm">در انتظار تأیید</span>
      ) : (
        props.estatStatus === 3 && (
          <span className="text-white  text-sm">تأیید نشده</span>
        )
      )}
    </div>
  );
};

export default LabelStatusEstatecard;
