import { defaultForm, EstateForm } from "./EstateForm";

interface EstateLocation {
  id: string;
  name: string;
}

const defaultLocation: EstateLocation = {
  id: "",
  name: "",
};

interface RejectionStatus {
  description: string;
  rejected: boolean;
}

const defaultRejectionStatus: RejectionStatus = {
  description: "",
  rejected: false,
};

interface Estate {
  id: string;
  province: EstateLocation;
  city: EstateLocation;
  neighborhood: EstateLocation;
  rejectionStatus: RejectionStatus;
  dataForm: EstateForm;
}

const defaultEstate: Estate = {
  id: "",
  city: defaultLocation,
  province: defaultLocation,
  neighborhood: defaultLocation,
  rejectionStatus: defaultRejectionStatus,
  dataForm: defaultForm,
};

export type { Estate, EstateLocation, RejectionStatus };
export { defaultEstate, defaultLocation, defaultRejectionStatus };
