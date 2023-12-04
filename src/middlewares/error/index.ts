import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

import logger from '../../utils/logger';
import { errorResponse } from '../../utils/responses';
import ApiError from './ApiError';
import { nodeEnv } from '../../config';
import { JsonWebTokenError } from 'jsonwebtoken';

const errorHandler = (
  err: ErrorRequestHandler | MongoError ,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log('a');
  let message = 'Oops, something went wrong. Please try again later';
  let errCode = 500;

  if (err instanceof ApiError) {
    message = err.message;
    errCode = err.code;
  } else if (err instanceof MongooseError.CastError) {
    //handle mongoose cast error
    message = `Invalid ${err.path}: ${err.value}.`;
    errCode = 400;
  } else if (err instanceof MongooseError.ValidationError) {
    //handle mongoose field validation error
    const errors: string[] = Object.values(err.errors).map(
      (
        error:
          | MongooseError.CastError
          | MongooseError.ValidationError
          | MongooseError.ValidatorError,
      ) => error.message,
    );

    message = `Invalid input data. ${errors.join('. ')}`;
    errCode = 400;
  } else if (err instanceof MongooseError.MissingSchemaError) {
    message = `An Error occured processing your request`;
    errCode = 422;
    logger.error(err.message);
  } else if ((err as MongoError).code === 11000) {
    //handle mongoose duplicate field errors
    const value: string =
      (err as MongoError).errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || '';

    message = `Duplicate field value: ${value}. Please use another value!`;
    errCode = 400;
  } else if (err instanceof JsonWebTokenError) {
    //handle jwt errors
    // @ts-ignore
    message = err.message;
    errCode = 403;
  } else if (err instanceof Error) {
    //handle multer errors
    message = err.message;
    errCode = 422;
  } else if (
    err instanceof SyntaxError ||
    err instanceof EvalError ||
    err instanceof RangeError ||
    err instanceof ReferenceError ||
    err instanceof TypeError ||
    err instanceof URIError
  ) {
    //handle global error types
    message = err.message;
    errCode = 400;
  }

  logger.error(
    `[${req.method} ${req.url}] ${
      //convert other data types to strings to ensure readability in logs
      typeof message === 'string' ? message : JSON.stringify(message)
    }`,
  );
  if (nodeEnv !== 'test') console.error(err);

  errorResponse(res, errCode, message);
};

export default errorHandler;
