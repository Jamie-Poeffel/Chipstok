import { Router } from "express";
import { getAllPosts, likePost, newPost } from "../controllers/postController";

const router = Router();

router.get('/', getAllPosts);
router.post('/new', newPost);
router.post('/:id/like', likePost)

export default router;