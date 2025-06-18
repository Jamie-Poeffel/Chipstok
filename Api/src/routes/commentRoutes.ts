import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createComment, getComments, hasLikedComment, likeOrUnlikeComment } from "../controllers/commentController";

const Comments = Router();

Comments.get('/:id', authMiddleware, getComments);
Comments.post('/:id', authMiddleware, createComment);
Comments.post('/:id/likeorunlike', authMiddleware, likeOrUnlikeComment);
Comments.get('/:id/hasliked', authMiddleware, hasLikedComment)

export default Comments