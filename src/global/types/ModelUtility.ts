import Base from './Base';
import User, { Role } from './User';

class ModelUtility {
  static getBaseData(json: any): Base {
    return {
      createdAt: new Date(json.created_at),
      updateAt: new Date(json.updated_at),
    };
  }

  static getUserRole(jsonRole: string): Role {
    let role = Role.USER;

    switch (jsonRole) {
      case 'owner':
        role = Role.OWNER;
        break;
      case 'admin':
        role = Role.ADMIN;
        break;
    }

    return role;
  }

  static convertToUser(json: any): User {
    return {
      id: json.id,
      name: json.user_name,
      password: json.password,
      mobile: json.mobile,
      role: json.role,
      ...this.getBaseData(json),
    };
  }
}

export default ModelUtility;
