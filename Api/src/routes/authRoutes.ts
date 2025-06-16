import { Router } from "express";
import { login, MultiFactorAuth, success } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/login', login);
router.get('/auto', authMiddleware, success);
router.get('/2fa', MultiFactorAuth)

export default router;