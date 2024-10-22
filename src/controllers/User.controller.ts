import { Request, Response } from "express";
import { User } from "../models/User.model";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { CustomError, UserRequest } from "../model";
import ApiResponse from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";

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
        const avatarFiles = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const avatarLocalPath = avatarFiles?.avatar?.[0]?.path;        
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(400, "Avatar file is required")
        }

        const user = await User.create({
            avatar: avatar.url,
            firstName,
            lastName,
            email,
            password
        });
       
        if(!user){
            throw new ApiError(400, "User registration failed");
        }
        res.status(200)
        .json(new ApiResponse("User registered",{},200));
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
        const data = {
            user,
            token
        }
        res.status(200)
        .cookie("accessToken",token)
        .json(new ApiResponse("User loggedIn",data,200));
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

export const getUser = async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized user");
        }
        const user = await User.findById(userId).select("-password -accessToken");
        const data = {
            user
        }
        res.status(200)
        .json(new ApiResponse("User Details fetched",data,200));
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

export const editAvatar = async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const avatarFiles = req.files as {[fieldName: string]: Express.Multer.File[]} | undefined;
        const avatarLocalPath = avatarFiles?.avatar?.[0].path;
        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar file is required");
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(400, "Avatar file is required");
        }
        
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found");
        }
        user.avatar = avatar?.url;
        await user.save();
        res.status(200)
        .json(new ApiResponse("Avatar image updated",{},200));

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

export const addCoverImage = async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const coverImages = req.files as { [fieldname:string]: Express.Multer.File[]} | undefined;

        const coverImageLocalPath = coverImages?.coverImage?.[0].path;

        if(!coverImageLocalPath){
            throw new ApiError(400, "Cover image is required");
        }
        const cover = await uploadOnCloudinary(coverImageLocalPath);
        if (!cover) {
            throw new ApiError(400, "Cover Image is required");
        }
        
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        user.coverImage = cover.url;
        await user.save();
        res.status(200)
        .json(new ApiResponse("Cover Image updated",{},200));
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

export const followUser = async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const {userToFollowId} = req.body;
        const user = await User.findById(userToFollowId);
        if(!user){
            throw new ApiError(400, "Requested user doesn't exist");
        }
        let followersList = await User.findById(userId);
        if(followersList?.following.includes(userToFollowId)){
            throw new ApiError(400, "Already following this user");
        }
        followersList?.following.push(userToFollowId);
        await followersList?.save();
        res.status(200)
        .json(new ApiResponse("Following this user",{},200));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message)
        }
        else{
            res.status(500)
            .json("Some error occured");
        }
    }
}