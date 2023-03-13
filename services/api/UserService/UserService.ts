import { AxiosResponse } from "axios";
import GlobalState from "../../../global/states/GlobalState";
import User, { defaultUser, Role } from "../../../global/types/User";
import BaseService from "../BaseService";

class UserService extends BaseService {
  private userUrl = "/user";
  private signupUrl = "/signup";
  private loginUrl = "/signin";
  private verifyUrl = "/verify";
  private changePasswordUrl = "/change-password";

  async getAllUsers(role: Role = Role.USER): Promise<User[]> {
    let users: User[] = [];

    try {
      var response: AxiosResponse<any> = await this.Api.get(
        this.userUrl,
        this.config
      );
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
      const response = await this.Api.get(
        `${this.userUrl}/${userId}`,
        this.config
      );

      if (response.data) {
        const data = response.data as User;
        user = {
          ...user,
          id: data.id,
          name: data.name,
          mobile: data.mobile,
          role: data.role,
          credit: data.credit,
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
      const response: AxiosResponse<any> = await this.Api.post(this.loginUrl, {
        mobile,
        password,
      });

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
      // console.log(response);
    } catch (error: any) {
      console.log(error);

      throw error;
    }

    return globalState;
  }

  async signupUser(mobile: string, password: string): Promise<void> {
    try {
      const response = await this.Api.post(this.signupUrl, {
        mobile,
        password,
      });
      if (response.status === 200 && response.statusText === "OK") {
        if (response.data) {
          // toast.success(response.data as string);
          console.log(response.data as string);

          // alert(response.data as string);
        }
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editProfile(userId: string, name: string) {
    let user: User = defaultUser;

    if (userId === "") return;

    try {
      const response = await this.Api.put(
        `${this.userUrl}/${userId}`,
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
      await this.Api.put(`${this.userUrl}/${userId}`, { role }, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async verifyUser(
    mobile: string,
    code: string
  ): Promise<GlobalState | undefined> {
    let globalState: GlobalState | undefined = undefined;
    try {
      const response: AxiosResponse<any> = await this.Api.get(this.verifyUrl, {
        ...this.config,
        params: {
          mobile,
          code,
        },
      });
      const data = response.data;
      if (data) {
        const token = data.token as string;
        const user = data.user as User;
        globalState = {
          token: token,
          userId: user.id,
          role: user.role,
          loggedIn: true,
        };
      }
    } catch (error) {
      this.handleError(error);
    }

    return globalState;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    let message;
    try {
      let response = await this.Api.post(
        `${this.changePasswordUrl}`,
        {
          currentPassword,
          newPassword,
        },
        this.config
      );
      if (response.data) {
        message = response.data as string;
      }
    } catch (error) {
      this.handleError(error);
    }
    return message;
  }
}

export default UserService;
