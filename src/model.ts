import { Request } from "express";
import { Types } from "mongoose";

export interface Register{
    coverImage:String,
    avatar:String,
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    followers:Types.ObjectId[],
    following:Types.ObjectId[],
    isPasswordCorrect:(password:string)=>{}
}

export interface CommentModel{
    userId:Types.ObjectId,
    likes:number,
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

export interface Notification {
    type: string;
    message: string;
}