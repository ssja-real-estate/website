import { atom } from "recoil";

interface RejectEstate {
  estateId: string;
  description: string;
  showModal: boolean;
}

const defaultRejectEstate: RejectEstate = {
  estateId: "",
  description: "",
  showModal: false,
};

const rejectEstateAtom = atom<RejectEstate>({
  key: "RejectEstateState",
  default: defaultRejectEstate,
});

export type { RejectEstate };
export { defaultRejectEstate, rejectEstateAtom };
