import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';

export const userSignUp = async(req, res, next) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password) throw new ApiError(401, 'Provide all fields', '');

    const user = await User.create({
        name,
        email,
        password
    });

    const token = user.generateAccessToken();
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token',token,{httpOnly:true, secure: isProduction}).redirect('/home');
};