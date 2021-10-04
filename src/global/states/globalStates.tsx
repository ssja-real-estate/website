import { Role } from 'global/types/User';
import { TOKEN } from 'local';
import { atom } from 'recoil';

const isLoggedInAtom = atom({
  key: 'loggedInState',
  default: true,
});

const userTypeAtom = atom({
  key: 'userTypeState',
  default: Role.OWNER,
});

const tokenAtom = atom({
  key: 'tokenState',
  default: TOKEN,
});

export { isLoggedInAtom, userTypeAtom, tokenAtom };
