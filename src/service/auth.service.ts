import ApiError from '../middlewares/error/ApiError';
import UserModel from '../models/user.model';
import { ILogin, IUser } from '../types/user.type';
import { Request, Response } from 'express';


import {
  encryptPassword,
  generateToken,

  verifyPassword,
} from '../utils/helpers/security';
import {
  validateLogin,
  validateUser,
} from '../utils/validation/auth.validation';



export const create = async (
  createUserDto: IUser
) => {
  const { error } = validateUser(createUserDto);

  if (error) {
    throw new ApiError(400, error.message);
  }
  const encryptedPassword = await encryptPassword(createUserDto.password);
  createUserDto.password = encryptedPassword;
  const user = await UserModel.create(createUserDto);

  return user;
};

export const login = async (loginDto: ILogin) => {
  const { error } = validateLogin(loginDto);

  if (error) {
    throw new ApiError(400, error.message);
  }

  const user = await UserModel.findOne({ email: loginDto.email });

  if (!user) {
    throw new ApiError(401, 'invalid credentials');
  }

  await verifyPassword(user.password, loginDto.password);

  const [token] = generateToken(user.id, user.email);
  // user.refreshToken = refreshToken;

  await user.save();

 
  return { token, user: basicUser(user) };

};

const basicUser = (user: IUser) => {
  const { firstName, lastName, email } = user;

  return {
    firstName,
    lastName,
    email
  };
};


