import { Router } from 'express';
import { __dirname } from '../../path.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createTodo, getData, saveData, deleteTodo } from '../controllers/user.todos.js';

export const userRouter = Router();

userRouter.route('/createTodo').post(asyncHandler(authenticate),asyncHandler(createTodo));

userRouter.route('/getData').get(asyncHandler(authenticate),asyncHandler(getData));

userRouter.route('/saveData').patch(asyncHandler(authenticate), asyncHandler(saveData));

userRouter.route('/deleteTodo').delete(asyncHandler(authenticate), asyncHandler(deleteTodo));