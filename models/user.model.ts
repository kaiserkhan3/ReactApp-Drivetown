export interface IUser {
  rememberMe?: boolean;
  uPassword: string;
  uRole?: string;
  user_Id?: string;
  user_Name: string;
}

export interface IUserDetails {
  user_Id: number;
  user_Name: string;
  uRole: string;
  lot_Id: number;
  email: string;
  firstName: string;
  lastName: string;
  eAddress: null;
  phoneNumber: null;
  ssNumber: string;
  salaryType: null;
  salary: null;
  createDate: null;
  updatedDate: string;
  isActive: boolean;
  notes: null;
}
