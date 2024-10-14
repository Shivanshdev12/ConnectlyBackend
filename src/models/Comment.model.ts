import mongoose, { Schema } from "mongoose";
import { CommentModel } from "../model";

const commentSchema = new Schema<CommentModel>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            default:null
        },
        comments:{
            type:String,
            required:true,
            default:""
        }
    }
)

export const Comment = mongoose.model<CommentModel>("Comment", commentSchema);