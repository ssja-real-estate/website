import { defaultForm, EstateForm } from "./EstateForm";
import MapInfo, { defaultMapInfo } from "./MapInfo";

interface EstateLocation {
  id: string;
  name: string;
}

const defaultLocation: EstateLocation = {
  id: "",
  name: "",
};

export enum EstateStatus {
  Verified = 1,
  Unverified = 2,
  Rejected = 3,
}

interface Estate {
  id: string;
  province: EstateLocation;
  city: EstateLocation;
  neighborhood: EstateLocation;
  address: string;
  mapInfo: MapInfo;
  estateStatus: {
    description: string;
    status: EstateStatus;
  };
  dataForm: EstateForm;
  phone?: number;
}

const defaultEstate: Estate = {
  id: "",
  city: defaultLocation,
  province: defaultLocation,
  mapInfo: defaultMapInfo,
  address: "",
  neighborhood: defaultLocation,
  estateStatus: {
    description: "",
    status: EstateStatus.Unverified,
  },
  dataForm: defaultForm,
  phone: undefined
};
defaultEstate.mapInfo = defaultMapInfo;
export type { Estate, EstateLocation };
export { defaultEstate, defaultLocation };
