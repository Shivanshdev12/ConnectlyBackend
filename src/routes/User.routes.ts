import { Router } from "express";
import { addCoverImage, followUser, getFollowingforUser, getUser, loginUser, registerUser } from "../controllers/User.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJwt } from "../middleware/auth.middleware";
const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);
router.route("/getUser").get(verifyJwt, getUser);
router.route("/add-cover-image").post(upload.fields([{name:"coverImage", maxCount:1}]), verifyJwt, addCoverImage);
router.route("/follow-user").post(verifyJwt, followUser);
router.route("/get-following-list").get(verifyJwt, getFollowingforUser);

export default router;