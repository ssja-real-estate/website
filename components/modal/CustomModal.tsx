import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import Strings from "../../data/strings";
interface CustomModalProps {
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
  title = "Modal Title",
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
      document.body.style.overflow = "";
    };
  });
  const modalMui = (
    <div className="fixed bg-black/40 inset-0 z-50  flex h-full w-full items-center justify-center">
      <div className="py-3 justify-evenly bg-white h-50 rounded-lg gap-4 w-[40%]">
        <div className="text-dark-blue px-2">{title}</div>
        {children}
        <div className="flex flex-row items-center justify-end gap-2 px-2">
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
