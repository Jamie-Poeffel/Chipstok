import { Router } from "express";
import { createUser, getAllUsers, getUserByUsername } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getAllUsers);
router.get('/:username', authMiddleware, getUserByUsername);
router.post('/new', createUser);

export default router;