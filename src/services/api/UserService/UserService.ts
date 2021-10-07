import Strings from 'global/constants/strings';
import User, { Role } from 'global/types/User';
import { USER_URL } from 'local';
import toast from 'react-hot-toast';
import BaseService from '../BaseService';

class UserService extends BaseService {
  async getAllUsers(role: Role = Role.USER): Promise<User[]> {
    let users: User[] = [];

    try {
      var response = await this.Api.get(USER_URL, this.config);

      response.data.forEach((element: any) => {
        const user = element;
        if (user.role === role) {
          users.push(user);
        }
      });
    } catch (error) {
      toast.error(Strings.unknownError);
      console.log(error);
    }

    return users;
  }
}

export default UserService;
