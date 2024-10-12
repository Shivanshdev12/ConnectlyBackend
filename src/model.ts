import { Request } from "express";

export interface Register{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    isPasswordCorrect:(password:string)=>{}
}

export interface PostModel{
    title:string,
    description:string,
    image:string,
    likes:number,
    dislikes:number
}

export interface UserRequest extends Request{
    user?:any
}

export interface CustomError extends Error{
    statusCode:number;
    data:object;
    message:string;
}