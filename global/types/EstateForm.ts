import { Field } from "./Field";

interface EstateForm {
  id?: string;
  title: string;
  assignmentTypeId: string;
  estateTypeId: string;
  fields: Field[];
}

const defaultForm: EstateForm = {
  id: "",
  title: "",
  assignmentTypeId: "",
  estateTypeId: "",
  fields: [],
};

export type { EstateForm };
export { defaultForm };
