import { Response } from "express";
import { CustomError, UserRequest } from "../model";
import ApiError from "../utils/ApiError";

export const replyComment=(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(userId){
            throw new ApiError(401,"Unauthorized request");
        }
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message);
        }
        else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}