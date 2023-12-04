import { Types } from 'mongoose';
import ApiError from '../middlewares/error/ApiError';
import UserModel from '../models/user.model';
import { IPassword, IUpdateUser } from '../types/user.type';
import { encryptPassword, verifyPassword } from '../utils/helpers/security';
import { validateChangePassword } from '../utils/validation/auth.validation';

export const find = async () => {
  const user = await UserModel.find().select('-password ');
  return user;
};

export const findOne = async (id: string) => {
  const user = await UserModel.findById(id).select('-password');
  if (!user) {
    throw new ApiError(401, 'user not found');
  }
  return user;
};

export const findByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(401, 'user not found');
  }
  return user;
};

export const update = async (
  id: string,
  updateUserDto: IUpdateUser
) => {
 
  const user = await UserModel.findOneAndUpdate({ _id: id }, updateUserDto, {
    new: true,
  }).select('-password');

  return user;
};

export const deleteOne = async (id: string) => {
  await UserModel.deleteOne({ _id: id });
};

export const changePassword = async (
  passwordDto: IPassword,
  userId: Types.ObjectId,
) => {
  const { error } = validateChangePassword(passwordDto);

  if (error) {
    throw new ApiError(400, error.message);
  }

  const user = await UserModel.findById(userId.toString());

  if (!user) {
    throw new ApiError(401, 'user not found');
  }

  await verifyPassword(user.password, passwordDto.oldPassword);

  user.password = await encryptPassword(passwordDto.password);

  await user.save();
};
