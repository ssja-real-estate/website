import { AxiosRequestConfig } from 'axios';
import Strings from 'global/constants/strings';
import ModelUtility from 'global/types/ModelUtility';
import User, { Role } from 'global/types/User';
import toast from 'react-hot-toast';
import Api from '../base';

class UserService {
  config: AxiosRequestConfig | undefined;

  constructor(token: string) {
    this.config = {
      headers: {
        Authorization: token,
      },
    };
  }

  async fetchUsers(role: Role): Promise<User[]> {
    let users: User[] = [];
    try {
      var response = await Api.get('/users', this.config);

      response.data.forEach((element: any) => {
        users.push(ModelUtility.convertToUser(element));
      });
    } catch (error) {
      toast.error(Strings.errorFetchData);
    }

    return users;
  }
}

export default UserService;
