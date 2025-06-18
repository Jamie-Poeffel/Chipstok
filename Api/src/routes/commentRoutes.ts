import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getComments } from "../controllers/commentController";

const Comments = Router();

Comments.get('/:id', authMiddleware, getComments);

export default Comments