import React, { FC, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import * as FiIcon from "react-icons/fi";
import Strings from "../../data/strings";

import { CustomModalProps } from "./CustomModal";

const ModalAlert: FC<CustomModalProps> = ({
  show = false,
  title = "Modal Title",
  cancelTitle = "Close",
  successTitle = "Save",
  handleClose,
  handleSuccess,
  isLarge = false,
  isFullscreen = false,
  children,
}) => {
  console.log(show);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  });
  const modalMui = (
    <div className="fixed bg-black/40 inset-0 z-50  flex h-full w-full items-center justify-center">
      <div className="py-10 flex flex-col items-center justify-center  bg-white h-50 rounded-lg gap-4 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[40%]">
        <div className="">
          <FiIcon.FiAlertTriangle className="text-red-700 text-3xl" />
        </div>
        {/* <div className="text-dark-blue px-2">{title}</div> */}
        {children}
        {/* <div className="flex flex-row items-center justify-end gap-2 px-2">
          <button
            onClick={handleClose}
            className="px-7 py-2 bg-gray-400 text-white rounded-md"
          >
            {cancelTitle}
          </button>
          <button
            onClick={handleSuccess}
            className="px-7 py-2 bg-[#d99221] text-white rounded-md"
          >
            {Strings.save}
          </button>
        </div> */}
        <button
          onClick={handleClose}
          className="px-7 py-2 bg-gray-400 text-white rounded-md"
        >
          {cancelTitle}
        </button>
      </div>
    </div>
  );
  return show ? ReactDOM.createPortal(modalMui, document.body) : null;
};

export default ModalAlert;
