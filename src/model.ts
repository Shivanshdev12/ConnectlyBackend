import { Request } from "express";
import { Schema, Types } from "mongoose";

export interface Register{
    avatar:String,
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    isPasswordCorrect:(password:string)=>{}
}

export interface CommentModel{
    userId:Types.ObjectId,
    comments:string,
    replies:Types.ObjectId[]
}

export interface PostModel{
    userId:Types.ObjectId,
    title:string,
    description:string,
    image:string,
    likes:number,
    dislikes:number,
    comments:Types.ObjectId[]
}

export interface UserRequest extends Request{
    files?:any,
    user?:any
}

export interface CustomError extends Error{
    statusCode:number;
    data:object;
    message:string;
}