import { Router } from "express";
import { getUser, loginUser, registerUser } from "../controllers/User.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJwt } from "../middleware/auth.middleware";
const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);
router.route("/getUser").get(verifyJwt, getUser);

export default router;