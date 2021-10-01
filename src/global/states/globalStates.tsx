import { TOKEN } from 'local';
import { atom } from 'recoil';

enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  User = 'user',
}

const isLoggedInAtom = atom({
  key: 'loggedInState',
  default: true,
});

const userTypeAtom = atom({
  key: 'userTypeState',
  default: UserRole.Owner,
});

const tokenAtom = atom({
  key: 'token',
  default: TOKEN,
});

export { UserRole, isLoggedInAtom, userTypeAtom, tokenAtom };
