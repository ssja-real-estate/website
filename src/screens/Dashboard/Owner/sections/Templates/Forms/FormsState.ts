import { atom } from "recoil";

import {
  defaultField,
  Field,
  FieldInputNecessity,
  FieldType,
} from "global/types/Field";
import Section, { defaultSection } from "global/types/Section";

export interface EditFieldModalData {
  index: number;
  newTitle: string;
  newType: number;
  newFieldInputNecessity?: FieldInputNecessity;
  filterable?: boolean;
}

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
    type: FieldType.BooleanConditional,
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

export const defaultSelectiveInnerFieldModalData: Modal<Field> = {
  index: -1,
  data: {
    ...defaultField,
    type: FieldType.SelectiveConditional,
    value: {},
    options: [],
    fieldMaps: [],
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

export const selectiveInnerFieldModalDataAtom = atom<Modal<Field>>({
  key: "ownerSelectiveInnerFieldModalDataState",
  default: defaultSelectiveInnerFieldModalData,
});
