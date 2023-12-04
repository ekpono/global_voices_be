import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { findOne } from '../service/user.service';
import { validateToken } from '../utils/helpers/security';
import { asyncHandler } from './async';
import ApiError from './error/ApiError';

export const signInMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auth = req?.headers?.authorization;
    let token;

    if (!auth) {
      return next(new ApiError(403, 'No token provided'));
    }

    if (auth.startsWith('Bearer ')) {
      token = auth.split('Bearer ')[1];
    }

    if (!token) {
      return next(new ApiError(403, 'Invalid token'));
    }

    const claims = validateToken(token) as JwtPayload;

    const user = await findOne(claims['id']);

    if (!user) {
      return next(new ApiError(403, 'Invalid token'));
    }

    // GRANT ACCESS TO PROTECTED ROUTE

    //@ts-ignore
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  },
);
