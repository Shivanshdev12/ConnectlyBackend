import {Request, Response} from "express";
import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import dotenv from "dotenv";

dotenv.config({});

const connectDB=async()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("DB Connected!");
    }
    catch(err){
        console.log("Some error occured!");
    }
}

export default connectDB;