import { Router } from "express";
import { getAllPosts, likePost, newPost, getStream } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getAllPosts);
router.post('/new', authMiddleware, newPost);
router.post('/:id/like', authMiddleware, likePost);
router.get('/stream/:id', authMiddleware, getStream)

export default router;