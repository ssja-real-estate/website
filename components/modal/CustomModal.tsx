import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import Strings from "../../data/strings";
export interface CustomModalProps {
  show: boolean;
  title?: string;
  cancelTitle?: string;
  successTitle?: string;
  isLarge?: boolean;
  isFullscreen?: boolean;
  handleClose: () => void;
  handleSuccess?: () => void;
  children?: JSX.Element;
}

const CustomModal: FC<CustomModalProps> = ({
  show = false,
  title,
  cancelTitle = "Close",
  successTitle = "Save",
  handleClose,
  handleSuccess,
  isLarge = false,
  isFullscreen = false,
  children,
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.removeAttribute("style");
    };
  });
  const modalMui = (
    <div className="fixed bg-black/40 inset-0 z-50  flex h-full w-full items-center justify-center">
      <div
        className={`py-3 justify-evenly bg-white ${
          isFullscreen
            ? "w-full h-full"
            : "rounded-lg gap-4 h-50 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[40%]"
        }  `}
      >
        {title && (
          <div className="text-dark-blue px-2 text-2xl font-bold">{title}</div>
        )}
        {children}
        <div
          className={` ${
            isFullscreen && "sticky bottom-1"
          } flex flex-row items-center justify-end gap-2 px-2`}
        >
          <button
            onClick={handleClose}
            className="px-7 py-2 bg-gray-400 text-white rounded-md"
          >
            {Strings.cancel}
          </button>
          <button
            onClick={handleSuccess}
            className="px-7 py-2 bg-[#d99221] text-white rounded-md"
          >
            {Strings.save}
          </button>
        </div>
      </div>
    </div>
  );
  return show ? ReactDOM.createPortal(modalMui, document.body) : null;
};

export default CustomModal;
