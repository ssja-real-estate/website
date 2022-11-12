import { atom } from "recoil";

const commissionModalState = atom({
  key: "commissionModalState",
  default: {
    showCommissionModal: false,
  },
});

export default commissionModalState;
