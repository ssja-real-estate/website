import Base from './Base';

enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

interface User extends Base {
  id: string;
  name?: string;
  password?: string;
  mobile: string;
  role: Role;
}

export default User;
export { Role };
