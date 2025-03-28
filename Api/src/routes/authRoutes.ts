import { Router } from "express";
import { login, success } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/login', login);
router.get('/auto', authMiddleware, success);

export default router;