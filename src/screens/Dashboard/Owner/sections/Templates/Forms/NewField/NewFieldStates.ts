import { Field } from "global/types/Field";
import { atom } from "recoil";

export const innerFieldsAtom = atom<Field[]>({
  key: "ownerInnerFieldsState",
  default: [],
});

export const optionsAtom = atom<string[]>({
  key: "ownerModalOptionsState",
  default: [],
});
