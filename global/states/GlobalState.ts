import { Role } from "../../global/types/User";

interface GlobalState {
  userId: string;
  token: string;
  role: Role;
  loggedIn: boolean;
  name: string;
}

const defaultGlobalState: GlobalState = {
  userId: "",
  token: "",
  role: Role.USER,
  loggedIn: false,
  name: "",
};

export const imagesBaseUrl = "https://ssja.ir/api/images";

export default GlobalState;
export { defaultGlobalState };
