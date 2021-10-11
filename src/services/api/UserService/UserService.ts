import GlobalState from 'global/states/GlobalState';
import User, { defaultUser, Role } from 'global/types/User';
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

  async getUser(userId: string) {
    let user: User = defaultUser;

    try {
      const response = await this.Api.get(`${USER_URL}/${userId}`, this.config);

      if (response.data) {
        const data = response.data as User;
        user = {
          ...user,
          id: data.id,
          name: data.name,
          mobile: data.mobile,
          role: data.role,
        };
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return user;
  }

  async loginUser(
    mobile: string,
    password: string
  ): Promise<GlobalState | undefined> {
    let globalState: GlobalState | undefined = undefined;
    try {
      const response = await this.Api.post(LOGIN_URL, { mobile, password });

      if (response.data) {
        const token = response.data.token as string;
        const user = response.data.user as User;
        globalState = {
          userId: user.id,
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
          userId: user.id,
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

  async editProfile(userId: string, name: string) {
    let user: User = defaultUser;

    if (userId === '') return;

    try {
      const response = await this.Api.put(
        `${USER_URL}/${userId}`,
        {
          name,
        },
        this.config
      );
      if (response.data) {
        user = response.data as User;
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return user;
  }

  async changeUserRole(userId: string, role: Role) {
    if (!userId) return;

    try {
      await this.Api.put(`${USER_URL}/${userId}`, { role }, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default UserService;
