import * as bcrypt from 'bcrypt';
import {
  accessTokenExpiresIn,
  jwtSecret,
  expTime,
  refreshTokenExpiresIn,
} from '../../config';
import ApiError from '../../middlewares/error/ApiError';
import * as jwt from 'jsonwebtoken';

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);

  return encryptedPassword;
};

export const verifyPassword = async (
  userPassword: string,
  password: string,
) => {
  //checks if userPassword and password are the same
  const isMatch = await bcrypt.compare(password, userPassword);

  if (!isMatch) {
    throw new ApiError(400, 'Password is incorrect');
  }
};

export const generateToken = (id: string, email: string) => {
  const accessToken = jwt.sign({ id, email }, jwtSecret, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign({ email }, jwtSecret, {
    expiresIn: refreshTokenExpiresIn,
  });

  return [accessToken, refreshToken];
};

export const validateToken = (token: any) => {
  return jwt.verify(token, jwtSecret);
};

export const generatePasswordToken = (email: string) => {
  const token = jwt.sign({ email }, jwtSecret, {
    expiresIn: expTime,
  });

  return token;
};

export const checkPasswordToken = async (passwordToken: string) => {
  try {
    jwt.verify(passwordToken, jwtSecret);
  } catch (error) {
    throw new ApiError(403, 'otp expired!');
  }
};


