import express,{Response} from "express";
import cookieParser from "cookie-parser";
import connectDB from "./db";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import ApiResponse from "./utils/ApiResponse";
import { CustomError, Notification, UserRequest } from "./model";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST","DELETE","OPTIONS","PUT"]
    }
});

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials:true
};

app.use(cors(corsOptions));

connectDB();

import userRouter from "./routes/User.routes";
import postRouter from "./routes/Post.routes";
import commentRouter from "./routes/Comment.routes";

app.post("/api/v1/notify",async (req:UserRequest, res:Response)=>{
    try{
        const {type,message}:Notification = req.body;
        io.emit("notification",{type,message});
        res.status(200).json(new ApiResponse("Success",{},200));
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
});

io.on("connection",(socket)=>{
    console.log('A user connected',socket.id);
    socket.on("disconnect",()=>{
        console.log("A user disconnected", socket.id);
    })
})

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/comments", commentRouter);

server.listen(`${process.env.PORT}`,()=>{
    try{
        console.log("App listening on port",`${process.env.PORT}`);
    }
    catch(err){
        console.log(err);
    }
});  

export {app};