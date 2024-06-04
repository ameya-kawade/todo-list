export class ApiResponse{
    constructor(statusCode = 200, msg = "", data){
        this.statusCode = statusCode;
        this.msg = msg;
        this.success = statusCode >= 200 && statusCode < 300;
        this.data = data; 
    }
}