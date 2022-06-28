import { Field } from "global/types/Field";
import { atom } from "recoil";

export const selectiveInnerFieldsAtom = atom<{ [key: string]: Field[] }>({
  key: "ownerSelectiveInnerFieldsState",
  default: {},
});

export const innerFieldsAtom = atom<Field[]>({
  key: "ownerInnerFieldsState",
  default: [],
});

export const optionsAtom = atom<string[]>({
  key: "ownerModalOptionsState",
  default: [],
});
