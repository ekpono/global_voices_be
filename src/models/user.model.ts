
import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.type';

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
    },
    isLock: {
      type: Boolean,
      default: true
    },

    refreshToken: {
      type: String,
    },
    passwordToken: {
      type: String,
    },

    passwordOtp: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model('User', UserSchema);
