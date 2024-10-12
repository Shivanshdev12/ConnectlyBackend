import express from "express";
import connectDB from "./db";
const app = express();

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));

connectDB();

import userRouter from "./routes/User.routes";
import postRouter from "./routes/Post.routes";

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);

app.listen(`${process.env.PORT}`,()=>{
    try{
        console.log("App listening on port",`${process.env.PORT}`);
    }
    catch(err){
        console.log(err);
    }
});  

export {app};