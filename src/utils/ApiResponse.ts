class ApiResponse{
    message:string;
    statusCode:number;
    status:string;
    data:object;
    constructor(message: string, data:object, statusCode:number){
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.status = 'success';
    }
}

export default ApiResponse;