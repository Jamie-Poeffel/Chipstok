import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/new', createUser);

export default router;