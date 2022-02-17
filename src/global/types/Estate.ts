import { defaultForm, EstateForm } from "./EstateForm";

interface Estate {
  id: string;
  cityId: string;
  provinceId: string;
  neighborhoodId: string;
  dataForm: EstateForm;
}

const defaultEstate: Estate = {
  id: "",
  cityId: "",
  provinceId: "",
  neighborhoodId: "",
  dataForm: defaultForm,
};

export type { Estate };
export { defaultEstate };
