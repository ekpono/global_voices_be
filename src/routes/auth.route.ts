import { Router } from 'express';
import {

  Login,
 
  Signup,

} from '../controllers/auth.controller';



const authRoute = Router();


authRoute.route('/signup').post(Signup);
authRoute.route('/login').post(Login);



export default authRoute;
