import { Request, Response } from "express";
import { User } from "../models/User.model";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { CustomError } from "../model";

const generateAuthToken = async(userId:object)=>{
    const id = await User.findById(userId);
    if(!id){
        return;
    }
    return jwt.sign(
        {
            id:id._id
        },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn:`${process.env.ACCESS_SECRET_EXPIRY}`
        }
    )
}

export const registerUser = async (req: Request,res: Response)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });
        if(!user){
            throw new ApiError(400, "User registration failed");
        }
        res.status(200)
        .json("User registered!");
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

export const loginUser = async (req:Request, res:Response)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(404,"User not found!");   
        }
        const isValid = await user?.isPasswordCorrect(password);
        if(!isValid){
            throw new ApiError(400,"Password not valid");
        }
        const token = await generateAuthToken(user._id);
        res.status(200)
        .cookie("accessToken",token)
        .json({
            data:{
                user,
                token
            },
            message:"User logged In!"
        })
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