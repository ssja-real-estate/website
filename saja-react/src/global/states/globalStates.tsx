import { atom } from "recoil";

enum UserRole {
    Admin = "admin",
    User = "user",
}

const isLoggedInAtom = atom({
    key: "loggedInState",
    default: true,
});

const userTypeAtom = atom({
    key: "userTypeState",
    default: UserRole.Admin,
});

export { isLoggedInAtom, userTypeAtom };
