import mongoose, { Schema } from "mongoose";

const postSavedSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref:"Post",
        unique:true
    }]
},{
    timestamps:true
})

export const PostSaved = mongoose.model("PostSaved", postSavedSchema);