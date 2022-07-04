import { defaultField, Field } from "global/types/Field";
import { atom } from "recoil";

export const selectiveInnerFieldsAtom = atom<Field>({
  key: "ownerSelectiveInnerFieldsState",
  default: defaultField,
});

export const innerFieldsAtom = atom<Field[]>({
  key: "ownerInnerFieldsState",
  default: [],
});

export const optionsAtom = atom<string[]>({
  key: "ownerModalOptionsState",
  default: [],
});
