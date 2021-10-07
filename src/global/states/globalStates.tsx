import GlobalState from 'global/states/GlobalState';
import { Role } from 'global/types/User';
// import { TOKEN } from 'local';
import { atom } from 'recoil';

// const isLoggedInAtom = atom({
//   key: 'loggedInState',
//   default: false,
// });

// const userTypeAtom = atom({
//   key: 'userTypeState',
//   default: Role.USER,
// });

// const tokenAtom = atom({
//   key: 'tokenState',
//   default: TOKEN,
// });

const globalState = atom<GlobalState>({
  key: 'globalState',
  default: {
    token: '',
    role: Role.USER,
    loggedIn: false,
  },
});

export { globalState };
