import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';
import {validationResult} from 'express-validator';

export const userLogin = async(req, res, next) =>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        console.log(result);
        const errorMessages = result.array().map(error => error.msg);
        throw new ApiError(402, errorMessages.join('\n'));
    }
    const {email, password} = req.body;

    if(!email || !password) throw new ApiError(401, 'Provide all fields', '');

    const user = await User.findOne({email: email});

    if(!user) throw new ApiError(401, 'Email is wrong','');

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) throw new ApiError(401,'Password is wrong','');

    const token = user.generateAccessToken();

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token',token,{httpOnly:true, secure: isProduction}).redirect('/home');
};