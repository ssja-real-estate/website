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

export default User;
export { Role };
