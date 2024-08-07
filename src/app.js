import express from "express";
import cookieParser from "cookie-parser";
import { __dirname } from '../path.js';
import { join } from "path";

export const app = express();
app.set('trust proxy', true);
app.use('/static',express.static( join(__dirname, 'public') ));
app.use(express.urlencoded({extended:false,limit:'16kb'}));
app.use(express.json({limit:'16kb'}));
app.use(cookieParser());


// routes
import { rootRouter } from "./routes/root.routes.js";
import { userRouter } from './routes/user.routes.js';

app.use('/', rootRouter);
app.use('/user', userRouter);