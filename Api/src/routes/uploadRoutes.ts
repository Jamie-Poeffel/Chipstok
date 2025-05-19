import { Router } from "express";
import { uploadProfile } from "../config/multerConfig";
import { PostUpload, ProfileUpload } from "../controllers/uploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../services/uploadService";

const router = Router();

router.post('/profile', authMiddleware, uploadProfile.single('profileImage'), ProfileUpload)
router.post('/post', authMiddleware, uploadMiddleware, PostUpload)

export default router;