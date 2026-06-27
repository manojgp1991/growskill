export interface LoggedInUser {
  Id: number;
  SubcriptionId: string;
  RoleId: number;
  RoleName: string;
  InternalCode: string;
  Name: string;
  Email: string;
  AllowLogin: boolean;
  role: IRole[];
  moduleAccess: IModuleAccess[];
  permissions: IPermission[];
}
export interface IRole {
  id: number;
  role: string;
  icon: string;
}

export interface IModuleAccess {
  id: number;
  module_id: number;
  module_name: string;
  allow_access: boolean;
}

export interface IPermission {
  id: number;
  role_id: number;
  role: string;
  allow_read: boolean;
  allow_write: boolean;
}
