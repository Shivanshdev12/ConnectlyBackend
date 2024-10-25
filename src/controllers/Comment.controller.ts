import { Response } from "express";
import { CustomError, UserRequest } from "../model";
import { Comment } from "../models/Comment.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const replyComment=async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401,"Unauthorized request");
        }
        const commentId = req.params.id;
        const {reply} = req.body;
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new ApiError(404, "Comment not found");
        }
        const repliedComment = await Comment.create({
            userId,
            comments:reply
        });
        comment.replies.push(repliedComment._id);
        await comment.save();
        const data = {
            comment
        }
        res.status(201)
        .json(new ApiResponse("Reply added to comment",data,201));
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

export const likeComment=async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const commentId = req.params.id;
        if(!commentId){
            throw new ApiError(400, "Comment not found");
        }
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new ApiError(400, "Comment not found");
        }
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message)
        }else{
            res.status(500)
            .json("Some error occured");
        }
    }
}