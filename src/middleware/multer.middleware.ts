import multer from "multer";
import { UserRequest } from "../model";

const storage = multer.diskStorage({
    destination: function (req:UserRequest, file, cb) {
      cb(null, "./public")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})