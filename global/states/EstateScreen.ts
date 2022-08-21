import { defaultEstate, Estate } from "../../global/types/Estate";
import { atom } from "recoil";

export enum ScreenType {
  Add = 1,
  Edit = 2,
}

interface EstateScreenState {
  inputEstate: Estate;
  screenType: ScreenType;
}

const defaultEstateScreen: EstateScreenState = {
  inputEstate: defaultEstate,
  screenType: ScreenType.Add,
};

const estateScreenAtom = atom<EstateScreenState>({
  key: "estateScreenAtom",
  default: defaultEstateScreen,
});

export type { EstateScreenState };
export { defaultEstateScreen, estateScreenAtom };
