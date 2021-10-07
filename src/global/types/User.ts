enum Role {
  OWNER = 0,
  ADMIN = 1,
  USER = 2,
}

interface User {
  id: string;
  name?: string;
  password?: string;
  mobile: string;
  role: Role;
}

export default User;
export { Role };
