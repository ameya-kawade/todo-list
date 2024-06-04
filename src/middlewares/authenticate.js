import jwt from "jsonwebtoken";

export const rootAuthenticate = async(req, res, next) => {
    const token = req?.cookies?.token;

    if(! token) return next();

    const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    if(! user) {
        res.clearCookie('token');
        return next();
    }
    req.user = user;
    
    res.redirect('/home');
};

export const authenticate = async(req, res, next) => {
    const token = req?.cookies?.token;

    if(! token) return res.redirect('/');

    const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    if(! user) return res.clearCookie('token').redirect('/');

    req.user = user;

    next();
};