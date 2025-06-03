import { Router } from "express";
import { getPosts, likePost, getStream, getThumbnail, unlikePost, isLiked } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getPosts);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/unlike', authMiddleware, unlikePost);
router.get('/:id/isLiked', authMiddleware, isLiked)
router.get('/stream/:id', getStream);
router.get('/thumbnail/:id', getThumbnail);

export default router;