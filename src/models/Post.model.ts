import mongoose, { Schema, Types } from "mongoose";
import { PostModel } from "../model";

const postSchema = new Schema<PostModel>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }]
},{
    timestamps:true
})

export const Post = mongoose.model<PostModel>('Post', postSchema);