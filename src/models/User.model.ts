import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Register } from "../model";

const userSchema = new Schema<Register>({
    coverImage:{
        type:String,
        required:false,
        default:""
    },
    avatar:{
        type:String,
        required:false,
        default:"",
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    following:[{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }]
},{
    timestamps:true
});

userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

userSchema.methods.isPasswordCorrect = async function(password:string){
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model<Register>("User", userSchema);