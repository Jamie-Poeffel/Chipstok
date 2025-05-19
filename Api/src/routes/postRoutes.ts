import { Router } from "express";
import { getPosts, likePost, getStream } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getPosts);
router.post('/:id/like', authMiddleware, likePost);
router.get('/stream/:id', getStream)

export default router;