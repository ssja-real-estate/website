import { Field, FieldType } from "global/types/Field";
import Section, { defaultSection } from "global/types/Section";
import { atom } from "recoil";

export type ModalSection = {
  index: number;
  section: Section;
};

export const defaultModalSection = {
  index: -1,
  section: defaultSection,
};

export const modalSectionAtom = atom<ModalSection>({
  key: "ownerModalSectionState",
  default: {
    index: -1,
    section: defaultSection,
  },
});

export const innerFieldModalDataAtom = atom<Field>({
  key: "ownerEditInnerFieldsModalDataState",
  default: {
    id: "",
    title: "",
    type: FieldType.Conditional,
    value: false,
    fields: [],
  },
});

export const editSelectFieldModalDataAtom = atom<Field>({
  key: "ownerEditSelectFieldModalState",
  default: {
    id: "",
    title: "",
    type: FieldType.Select,
    value: "",
    options: [],
  },
});
