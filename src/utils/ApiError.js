export class ApiError extends Error{
    constructor(statusCode, msg, stack){
        super(msg);
        this.statusCode = statusCode;
        this.msg = msg;
        if(stack){
            this.stack = stack;
        }
        else{
            this.stack = Error.captureStackTrace(this, this.constructor);
        }
    }
}