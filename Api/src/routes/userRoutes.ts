import { Router } from "express";
import { createUser, getAllUsers, getUserByUsername, isUserFollowing, followUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getAllUsers);
router.post('/:username/follow', authMiddleware, followUser);
router.get('/:username/isFollowing', authMiddleware, isUserFollowing);
router.get('/:username', authMiddleware, getUserByUsername);
router.post('/new', createUser);

export default router;