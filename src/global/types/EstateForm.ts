import Section from "./Section";

interface EstateForm {
  id?: string;
  title: string;
  assignmentTypeId: string;
  estateTypeId: string;
  sections: Section[];
}

const defaultForm: EstateForm = {
  id: "",
  title: "",
  assignmentTypeId: "",
  estateTypeId: "",
  sections: [],
};

export type { EstateForm };
export { defaultForm };
