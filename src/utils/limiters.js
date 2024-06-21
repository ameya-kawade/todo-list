import { rateLimit } from 'express-rate-limit';


export const Getlimiter = rateLimit({
    windowMs: 12 * 60 * 60 * 1000,
    limit: 50,
    message: 'You have reached the limit to access the page try again after 12 hours'
});


export const PostLimiter = rateLimit({
    windowMs: 3 * 60 * 60 * 1000,
    limit: 5,
    message: 'You have reached the limit try again after 3 hours'
});

export const BlogLimiter = rateLimit({
    windowMs: 6 * 60 * 60 * 1000,
    limit: 100,
    message: 'You have reached the limit to access the page try again after 6 hours'
});

