import { defaultEstate, Estate } from "global/types/Estate";
import { atom } from "recoil";

interface EstateInfoModalState {
  estate: Estate;
  showModal: boolean;
}

export const defaultEstateInfoModalState: EstateInfoModalState = {
  estate: defaultEstate,
  showModal: false,
};

export const estateInfoModalAtom = atom({
  key: "estateInfoModal",
  default: defaultEstateInfoModalState,
});

export default EstateInfoModalState;
