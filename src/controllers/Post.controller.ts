import { Request, Response } from "express"
import { CustomError, UserRequest } from "../model";
import { Post } from "../models/Post.model";
import ApiError from "../utils/ApiError";

export const createPost=async(req:UserRequest,res:Response)=>{
    try{
        const user = req.user;
        if(!user){
            throw new ApiError(401, "Unauthorized request");
        }
        const {title, description, image} = req.body;
        console.log(title, description);
        const post = await Post.create({
            title,
            description,
            image
        })
        res.status(200)
        .json(post);
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