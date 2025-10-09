import { atom } from "recoil";
import MapInfo from "../../global/types/MapInfo";

enum EditItemType {
  DelegationType = 0,
  EstateType = 1,
  Province = 2,
  City = 3,
  Neighborhood = 4,
  Unit = 5,
  Payment = 6,
}

interface EditItemModalState {
  id: string;
  value: string;
  order?:number;
  displayMap: boolean[];
  editMap: boolean[];
  mapInfo?: MapInfo;
  title?: string;
  credit?: number;
  duration?: number;
}

const defaultMap = [false, false, false, false, false, false, false];

const defaultEditItemModalState: EditItemModalState = {
  id: "",
  value: "",
  displayMap: [...defaultMap],
  editMap: [...defaultMap],
  title: "",
  credit: 0,
  order:1,
  duration: 0,
};

const buildMap = (type: EditItemType, flag: boolean = true) => {
  const length = defaultMap.length;
  let map = [...defaultMap];

  for (let i = 0; i < length; i++) {
    const value = type === i ? flag : false;
    map[i] = value;
  }

  return map;
};

const editItemModalState = atom<EditItemModalState>({
  key: "editItemModalState",
  default: defaultEditItemModalState,
});

export default editItemModalState;
export type { EditItemModalState };
export { EditItemType, defaultEditItemModalState, buildMap };
