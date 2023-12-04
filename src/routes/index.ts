import { NextFunction, Router, Request, Response } from 'express';
import { notFound } from '../middlewares/not-found.middleware';
// import userRoute from './user.route';
import authRoute from './auth.route';
import { signInMiddleware } from '../middlewares/signIn.middleware';



const indexRoute = Router();

indexRoute.route('/').get((req: Request, res: Response, next: NextFunction) => {
  res.send('Full Stack Codding Assessement API');
});

indexRoute.use('/auth', authRoute);
// indexRoute.use('/user', signInMiddleware, userRoute);
indexRoute.use(notFound);

export default indexRoute;
