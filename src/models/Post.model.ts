import mongoose, { Schema } from "mongoose";
import { PostModel } from "../model";


const postSchema = new Schema<PostModel>({
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
    }
},{
    timestamps:true
})

export const Post = mongoose.model<PostModel>('Post', postSchema);