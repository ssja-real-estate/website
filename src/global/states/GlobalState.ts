import { Role } from 'global/types/User';

interface GlobalState {
  token: string;
  role: Role;
  loggedIn: boolean;
}

export default GlobalState;
