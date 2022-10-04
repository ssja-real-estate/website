import { atom } from "recoil";
import { defaultField, Field } from "../../../../../../global/types/Field";

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
