import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { addComment, createPost, dislikePost, getPost, likePost } from "../controllers/Post.controller";
const router = Router();

router.route("/create-post").post(verifyJwt, createPost);
router.route("/add-comment").post(verifyJwt, addComment);
router.route("/get-posts").get(verifyJwt, getPost);
router.route("/like-post").post(verifyJwt, likePost);
router.route("/dislike-post").post(verifyJwt, dislikePost);

export default router;