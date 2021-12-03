import { Role } from "global/types/User";

interface GlobalState {
  userId: string;
  token: string;
  role: Role;
  loggedIn: boolean;
}

const defaultGlobalState: GlobalState = {
  userId: "",
  token: "",
  role: Role.USER,
  loggedIn: false,
};

export default GlobalState;
export { defaultGlobalState };
