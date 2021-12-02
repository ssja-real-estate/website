import { defaultField, Field, FieldType } from "global/types/Field";
import Section, { defaultSection } from "global/types/Section";
import { atom } from "recoil";

export type Modal<T> = {
  index: number;
  data: T;
};

export const defaultModalSection: Modal<Section> = {
  index: -1,
  data: defaultSection,
};

export const defaultInnerFieldModalData: Modal<Field> = {
  index: -1,
  data: {
    ...defaultField,
    type: FieldType.Conditional,
    value: false,
    fields: [],
  },
};

export const defaultEditSelectFieldModalData: Modal<Field> = {
  index: -1,
  data: {
    ...defaultField,
    type: FieldType.Select,
    value: "",
    options: [],
  },
};

export const modalSectionAtom = atom<Modal<Section>>({
  key: "ownerModalSectionState",
  default: defaultModalSection,
});

export const innerFieldModalDataAtom = atom<Modal<Field>>({
  key: "ownerEditInnerFieldsModalDataState",
  default: defaultInnerFieldModalData,
});

export const editSelectFieldModalDataAtom = atom<Modal<Field>>({
  key: "ownerEditSelectFieldModalState",
  default: defaultEditSelectFieldModalData,
});
