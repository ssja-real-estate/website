import { defaultForm, EstateForm } from "./EstateForm";

interface EstateLocation {
  id: string;
  name: string;
}

const defaultLocation: EstateLocation = {
  id: "",
  name: "",
};

interface Estate {
  id: string;
  province: EstateLocation;
  city: EstateLocation;
  neighborhood: EstateLocation;
  dataForm: EstateForm;
}

const defaultEstate: Estate = {
  id: "",
  city: defaultLocation,
  province: defaultLocation,
  neighborhood: defaultLocation,
  dataForm: defaultForm,
};

export type { Estate };
export { defaultEstate };
