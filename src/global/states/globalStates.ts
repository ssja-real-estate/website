import GlobalState from 'global/states/GlobalState';
import { Role } from 'global/types/User';
// import { TOKEN } from 'local';
import { atom } from 'recoil';

const globalState = atom<GlobalState>({
  key: 'globalState',
  default: {
    token: '',
    role: Role.USER,
    loggedIn: false,
    userId: '',
  },
});

export { globalState };
