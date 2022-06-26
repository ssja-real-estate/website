import { Field } from "./Field";

interface Section {
  id?: string;
  title?: string;
  fields: Field[];
}

const defaultSection: Section = {
  id: "",
  title: "",
  fields: [],
};

export default Section;
export { defaultSection };
