import { Router } from 'express';
import { __dirname } from '../../path.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createTodo, getData, saveData, deleteTodo } from '../controllers/user.todos.js';
import {BlogLimiter} from '../utils/limiters.js';


export const userRouter = Router();

userRouter.route('/createTodo').post(BlogLimiter ,asyncHandler(authenticate),asyncHandler(createTodo));

userRouter.route('/getData').get(BlogLimiter,asyncHandler(authenticate),asyncHandler(getData));

userRouter.route('/saveData').patch(BlogLimiter ,asyncHandler(authenticate), asyncHandler(saveData));

userRouter.route('/deleteTodo').delete(BlogLimiter ,asyncHandler(authenticate), asyncHandler(deleteTodo));