import { atom } from "recoil";

const isLoggedInAtom = atom({
    key: "loggedInState",
    default: true,
});

const userTypeAtom = atom({
    key: "userTypeState",
    default: "admin",
});

export { isLoggedInAtom, userTypeAtom };
