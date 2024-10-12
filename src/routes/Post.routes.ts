import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { createPost } from "../controllers/Post.controller";
const router = Router();

router.route("/create-post").post(verifyJwt, createPost);

export default router;