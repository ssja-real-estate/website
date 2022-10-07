import { defaultForm, EstateForm } from "./EstateForm";

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
  neighborhood: defaultLocation,
  estateStatus: {
    description: "",
    status: EstateStatus.Unverified,
  },
  dataForm: defaultForm,
  phone: undefined
};

export type { Estate, EstateLocation };
export { defaultEstate, defaultLocation };
