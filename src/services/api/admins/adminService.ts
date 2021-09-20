import { User } from "global/types/User";
import Api from "../base";


const fetchAdmins = async (token: string) => {
  let users: User[] = [];

  try {
    const data = await Api.get('/users', {
      headers: {
        'authorization': token
      }
    });

    data.data.forEach((userJson: any) => {
      let user: User = {
        id: userJson.id,
        userName: userJson.user_name,
        name: userJson.name,
        password: userJson.password,
        mobile: userJson.mobile,
        role: userJson.role,
        createdAt: new Date(userJson.created_at),
        updatedAt: new Date(userJson.updated_at),
      };

      users.push(user);
    });

  } catch (error) {
    console.log(error);
  }

  return users;
}


export { fetchAdmins };