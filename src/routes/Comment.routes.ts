import { Router } from "express";
import { replyComment } from "../controllers/Comment.controller";
import { verifyJwt } from "../middleware/auth.middleware";

const router = Router();

router.route("/reply-comment/:id").post(verifyJwt, replyComment);

export default router;