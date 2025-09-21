export interface IUser {
  rememberMe?: boolean;
  uPassword: string;
  uRole?: string;
  user_Id?: string;
  user_Name: string;
}
export interface ResponseDto {
  result: Result;
  isSuccess: boolean;
  message: string;
}

interface Result {
  user: User;
  token: string;
}

interface User {
  userId: number;
  userName: string;
  upassword: string;
  urole: string;
  lotId: number;
  email: string;
  firstName: string;
  lastName: string;
  eaddress: string;
  phoneNumber: string;
  ssnumber: string;
  salaryType: string;
  salary: number;
  createDate: Date;
  updatedDate: Date;
  isActive: boolean;
  notes: string;
}
