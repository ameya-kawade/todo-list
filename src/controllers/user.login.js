import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';

export const userLogin = async(req, res, next) =>{
    const {email, password} = req.body;

    if(!email || !password) throw new ApiError(401, 'Provide all fields', '');

    const user = await User.findOne({email: email});

    if(!user) throw new ApiError(401, 'Email is wrong','');

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) throw new ApiError(401,'Password is wrong','');

    const token = user.generateAccessToken();

    res.cookie('token',token,{httpOnly:true}).redirect('/home');
};