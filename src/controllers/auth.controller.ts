import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import {
  create,
  login
} from '../service/auth.service';

import { successLoginResponse, successResponse } from '../utils/responses';


export const Signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await create(req.body);
    return successResponse(res, 200, 'New user created successfully!');
  },
);

export const Login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginResponse = await login(req.body);

    if (loginResponse) {
      return successLoginResponse(
        res,
        200,
        'user login successfully!',
        loginResponse.token,
        loginResponse.user,
      );
    }else{
      return "error"
    }
   
  },
);




