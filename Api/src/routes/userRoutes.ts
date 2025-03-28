﻿import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../controllers/userController";

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/new', createUser);

export default router;