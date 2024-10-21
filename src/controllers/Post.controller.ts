import { Response } from "express"
import { CustomError, UserRequest } from "../model";
import { Post } from "../models/Post.model";
import { Comment } from "../models/Comment.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { PostSaved } from "../models/PostSaved.model";
import { uploadOnCloudinary } from "../utils/cloudinary";

export const createPost=async(req:UserRequest,res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const {title, description} = req.body;
        const imageFiles = 
        req.files as {[fieldname: string]: Express.Multer.File[]} | undefined;
        const imageLocalPath = imageFiles?.image?.[0]?.path;
        if(!imageLocalPath){
            throw new ApiError(400, "Image not uploaded");
        }
        const postImage = await uploadOnCloudinary(imageLocalPath);
        if(!postImage){
            throw new ApiError(400, "Image not uploaded");
        }
        const post = await Post.create({
            userId,
            title,
            description,
            image: postImage?.url
        })
        const data:object = {
            post
        }
        res.status(200)
        .json(new ApiResponse("Post created successfully", data, 200));
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

export const getPost = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Use populate to get the comments data for each post
        const posts = await Post.find({})
        .populate({
            path: 'comments',  // Populate comments
            populate: {
                path: 'replies',  // For each comment, populate replies
            }
        })
        .populate('userId');

        if (!posts || posts.length === 0) {
            throw new ApiError(404, "No Posts found");
        }

        const data = {
            posts
        };
        
        res.status(200).json(new ApiResponse("Posts fetched successfully", data, 200));
    } catch (err) {
        const customErr = err as CustomError;
        if (customErr.message) {
            res.status(customErr.statusCode).json(customErr.message);
        } else {
            res.status(500).json("Some error occurred!");
        }
    }
};

export const getUserPost = async (req:UserRequest, res:Response) => {
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401,"Unauthorized request");
        }
        const userPosts = await Post.find({userId});
        const data = {
            userPosts
        }
        res.status(200)
        .json(new ApiResponse("User posts fetched successfully", data, 200));
    }   
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message);
        }else{
            res.status(500)
            .json("Some error occured");
        }
    }
}

export const deletePost = async(req:UserRequest, res:Response) => {
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const postId = req.params.id;
        const result = await Post.findByIdAndDelete(postId);
        if(!result){
            throw new ApiError(401, "Some error occured while deleting post");
        } 
        res.status(200)
        .json(new ApiResponse("Post deleted successfully",{},200));
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

export const savePost = async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(400, "Unauthorized request");
        }
        const {postId} = req.body;
        if(!postId){
            throw new ApiError(400, "Post Id is required");
        }
        let savedPosts = await PostSaved.findOne({userId});
        if(savedPosts){
            if(savedPosts.posts.includes(postId)){
                throw new ApiError(400, "Post is already saved");
            }
            savedPosts.posts.push(postId);
            await savedPosts.save();

        }else{
            const newSavedPost = new PostSaved({
                userId,
                posts:[postId]
            });
            await newSavedPost.save();
        }
        savedPosts = await PostSaved.findOne({userId});
        const data = {
            savedPosts
        }
        res.status(201)
        .json(new ApiResponse("Post saved",data,201));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message);
        }else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}

export const addComment = async (req: UserRequest, res: Response) => {
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const {postId, commentBody} = req.body;
        const comment = await Comment.create({
            userId,
            comments:commentBody
        });
        if(!comment){
            throw new ApiError(500, "Some error occured while creating comment");
        }
        const post = await Post.findById(postId);
        if(!post){
            throw new ApiError(404, "Post not found");
        }
        await post?.comments.push(comment._id);
        await post?.save();
        res.status(200)
        .json(new ApiResponse("Comment added",{},200));
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
};

export const likePost = async (req:UserRequest, res:Response) => {
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(400, "Unauthorized request");
        }
        const {postId} = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {$inc:{likes:1}},
            {new:true}
        );
        if(!post){
            throw new ApiError(404, "Post not found");
        }
        res.status(200)
        .json(new ApiResponse("Post liked",post,200));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message);
        }else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}

export const dislikePost = async(req:UserRequest, res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(400, "Unauthorized request");
        }
        const {postId} = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {$inc:{dislikes:1}},
            {new:true}
        );
        if(!post){
            throw new ApiError(404, "Post not found");
        }
        res.status(200)
        .json(new ApiResponse("Post disliked",{},200));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message);
        }else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}
