import { Router } from 'express';
import { __dirname } from '../../path.js';
import { join } from 'path';
import { userLogin } from '../controllers/user.login.js';
import { userSignUp } from '../controllers/user.signup.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { rootAuthenticate,authenticate } from '../middlewares/authenticate.js';
import {body} from 'express-validator';
import {Getlimiter, PostLimiter} from '../utils/limiters.js';

export const rootRouter = Router();

rootRouter.route('/').get(Getlimiter ,asyncHandler(rootAuthenticate),(req, res)=>{
    res.sendFile( join(__dirname,'public','login.html') );
});

rootRouter.route('/login').post(
    PostLimiter,
    body('email').isEmail().escape(),
    body('password').escape(),
    asyncHandler(userLogin)
);

rootRouter.route('/signup').post(
    PostLimiter,
    body('name').escape(),
    body('email').isEmail().escape(),
    body('password').escape(),
    asyncHandler(userSignUp)
);

rootRouter.route('/home').get(Getlimiter ,asyncHandler(authenticate), (req,res)=>{
    res.sendFile( join(__dirname, 'public', 'userPage.html') );
});

rootRouter.route('/home/todo').get(Getlimiter ,asyncHandler(authenticate), (req, res)=>{
    res.sendFile(join(__dirname, 'public', 'todo.html'));
});