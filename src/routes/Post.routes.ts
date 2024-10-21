import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { addComment, createPost, deletePost, dislikePost, getPost, getUserPost, likePost, savePost } from "../controllers/Post.controller";
import { upload } from "../middleware/multer.middleware";
const router = Router();

router.route("/get-posts").get(verifyJwt, getPost);
router.route("/get-user-posts").get(verifyJwt, getUserPost);
router.route("/save-post").post(verifyJwt, savePost);
router.route("/create-post").post(verifyJwt, upload.fields([{name:"image",maxCount:1}]) , createPost);
router.route("/add-comment").post(verifyJwt, addComment);
router.route("/like-post").post(verifyJwt, likePost);
router.route("/dislike-post").post(verifyJwt, dislikePost);
router.route("/delete-post/:id").delete(verifyJwt, deletePost);

export default router;