import { ReactNode } from "react";

interface ModalOption {
  message: string;
  closeModal: () => void;
  icon?: JSX.Element;
}

export default ModalOption;
