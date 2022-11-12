import { atom } from "recoil";
import { defaultField, Field } from "../../../../../../global/types/Field";

export const selectiveInnerFieldsAtom = atom<Field>({
  key: "admiSelectiveInnerFieldsState",
  default: defaultField,
});

export const innerFieldsAtom = atom<Field[]>({
  key: "adminInnerFieldsState",
  default: [],
});

export const optionsAtom = atom<string[]>({
  key: "adminModalOptionsState",
  default: [],
});
