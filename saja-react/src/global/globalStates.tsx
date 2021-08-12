import { atom } from "recoil";

const isLoggedIn = atom({
    key: "loggedIn",
    default: true,
});

const userType = atom({
    key: "userType",
    default: "admin",
});

export { isLoggedIn, userType };
