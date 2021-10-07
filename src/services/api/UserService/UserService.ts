import Strings from 'global/constants/strings';
import User, { Role } from 'global/types/User';
import toast from 'react-hot-toast';
import BaseService from '../BaseService';

class UserService extends BaseService {
  async fetchUsers(role: Role = Role.USER): Promise<User[]> {
    let users: User[] = [];

    try {
      var response = await this.Api.get('/users', this.config);

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
