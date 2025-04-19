import { Router } from "express";
import { getAllPosts, likePost, newPost, getStream } from "../controllers/postController";

const router = Router();

router.get('/', getAllPosts);
router.post('/new', newPost);
router.post('/:id/like', likePost);
router.get('/stream/:id', getStream)

export default router;