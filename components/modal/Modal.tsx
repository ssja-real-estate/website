import { FC, ReactNode, useEffect, useState } from "react";
import ReactDOM, { Container } from "react-dom";
import ModalOption from "../../global/types/ModalOption";

const Modal: FC<{ options?: ModalOption; children?: ReactNode }> = (props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  });
  const modalUi = (
    <div className="fixed bg-black/40 inset-0 z-50 text-white flex h-full w-full items-start justify-center">
      <div className="mt-20 flex flex-col items-center p-10 justify-evenly bg-white h-50 rounded-2xl gap-4">
        {props.options?.icon}
        <div className="text-dark-blue">{props.options?.message}</div>

        <button
          className="border border-dark-blue p-1 text-sm w-[50%] text-dark-blue"
          onClick={() => {
            document.body.style.overflow = "";
            props.options?.closeModal();
          }}
        >
          بستن
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalUi, document.body);
};

export default Modal;
