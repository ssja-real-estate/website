import Strings from 'global/constants/strings';

enum Role {
  OWNER = 1,
  ADMIN = 2,
  USER = 3,
}

interface User {
  id: string;
  name?: string;
  password?: string;
  mobile: string;
  role: Role;
}

const defaultUser = {
  id: '',
  mobile: '',
  role: Role.USER,
};

const roleMap = [
  {
    role: Role.OWNER,
    roleName: Strings.ownerUser,
  },
  {
    role: Role.ADMIN,
    roleName: Strings.adminUser,
  },
  {
    role: Role.USER,
    roleName: Strings.normalUser,
  },
];

export default User;
export { Role, defaultUser, roleMap };
