import mongoose from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isLock: boolean,
  refreshToken: string;
  passwordToken: string;
  passwordOtp: string;
}

export interface IUserModel extends IUser {
  id: mongoose.Schema.Types.ObjectId;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  password?: string;
  isLock: boolean;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IResetPassword {
  email: string;
  passwordToken: string;
  passwordOtp: string;
  password: string;
}

export interface IPassword {
  oldPassword: string;
  password: string;
}
