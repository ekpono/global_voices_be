import { Response } from 'express';


export const successResponse = <SuccessData>(
  res: Response,
  statusCode: number,
  message: string,
  data?: SuccessData
): void => {
  res.status(statusCode).send({
    status: 'success',
    message,
    data
  });
};

export const successLoginResponse = <SuccessData>(
  res: Response,
  statusCode: number,
  message: string,
  token: string,
  data?: SuccessData,
): void => {
  res.status(statusCode).send({
    status: 'success',
    message,
    token,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  error: string,
): void => {
  res.status(statusCode).send({
    status: 'error',
    error,
  });
};
