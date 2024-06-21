import { Router } from 'express';
import { __dirname } from '../../path.js';
import { join } from 'path';
import { userLogin } from '../controllers/user.login.js';
import { userSignUp } from '../controllers/user.signup.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { rootAuthenticate,authenticate } from '../middlewares/authenticate.js';


export const rootRouter = Router();

rootRouter.route('/').get(asyncHandler(rootAuthenticate),(req, res)=>{
    res.sendFile( join(__dirname,'public','login.html') );
});

rootRouter.route('/login').post(asyncHandler(userLogin));

rootRouter.route('/signup').post(asyncHandler(userSignUp));

rootRouter.route('/home').get(asyncHandler(authenticate), (req,res)=>{
    res.sendFile( join(__dirname, 'public', 'userPage.html') );
});

rootRouter.route('/home/todo').get(asyncHandler(authenticate), (req, res)=>{
    res.sendFile(join(__dirname, 'public', 'todo.html'));
});