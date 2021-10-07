import GlobalState from 'global/states/GlobalState';
import User, { Role } from 'global/types/User';
import { LOGIN_URL, SIGNUP_URL, USER_URL } from 'local';
import BaseService from '../BaseService';

class UserService extends BaseService {
  async getAllUsers(role: Role = Role.USER): Promise<User[]> {
    let users: User[] = [];

    try {
      var response = await this.Api.get(USER_URL, this.config);
      if (response.data) {
        response.data.forEach((element: User) => {
          const user = element;
          if (user.role === role) {
            users.push(user);
          }
        });
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return users;
  }

  async loginUser(
    mobile: string,
    password: string
  ): Promise<GlobalState | undefined> {
    let globalState: GlobalState | undefined = undefined;
    try {
      const response = await this.Api.post(LOGIN_URL, { mobile, password });

      if (response.data) {
        console.log(response.data);
        const token = response.data.token as string;
        const user = response.data.user as User;
        globalState = {
          token: token,
          role: user.role,
          loggedIn: token.length !== 0,
        };
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return globalState;
  }

  async signupUser(
    mobile: string,
    password: string
  ): Promise<GlobalState | undefined> {
    let globalState: GlobalState | undefined = undefined;
    try {
      const response = await this.Api.post(SIGNUP_URL, { mobile, password });

      if (response.data) {
        const token = response.data.token as string;
        const user = response.data.user as User;
        globalState = {
          token: token,
          role: user.role,
          loggedIn: token.length !== 0,
        };
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return globalState;
  }
}

export default UserService;
