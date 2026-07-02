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
  profile: profileModel[];
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

export class addUserModel {
  id: number = 0;
  user_id: number = 0;
  sub_id: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  role_id: number = 0;
  actionType: number = 0;
}
export class profileModel {
  company_name: string = '';
  contact_person: string = '';
  slogan: string = '';
  phone: string = '';
  email:  string = '';
  gst_number:  string = '';
  address:  string = '';
  logo:  string = '';
}