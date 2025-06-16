import { Router } from "express";
import { profileUpload } from "../services/uploadService";
import { PostUpload, ProfileUpload } from "../controllers/uploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../services/uploadService";

const router = Router();

router.post('/profile', authMiddleware, profileUpload.single('profileImage'), ProfileUpload)
router.post('/post', authMiddleware, uploadMiddleware, PostUpload)

export default router;