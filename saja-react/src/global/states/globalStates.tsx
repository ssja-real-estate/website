import { atom } from "recoil";

enum UserRole {
    Owner = "owner",
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

export { UserRole, isLoggedInAtom, userTypeAtom };
