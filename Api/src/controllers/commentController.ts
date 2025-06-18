import { Request, Response, RequestHandler } from "express";
import { Post } from "../models/Posts";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { Op } from 'sequelize';

export const getComments: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.id;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 100;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const comments = await Comment.findAll({
            where: { postId },
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });

        // Optional: map output if you want to format it
        const formatted = comments.map(comment => ({
            id: comment._id,
            text: comment.text,
            likeCount: comment.likeCount,
            likesby: comment.likesBy,
            createdAt: comment.createdAt,
            user: {
                username: comment.user?.username || 'Unknown'
            }
        }));

        res.status(200).json(formatted);
    } catch (e: any) {
        console.error('Error fetching comments:', e.message);
        res.status(500).json({ message: e.message });
    }
};

export const createComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.id;
    const { text } = req.body as { text: string };
    const userId = (req as any).user?._id;

    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    try {
        // Create comment safely
        const comment = await Comment.create({
            postId,
            userId,
            text,
        } as any);

        await Post.increment('commentCount', { by: 1, where: { _id: postId } });

        const fullComment = await Comment.findByPk(comment._id, { include: [User, Post] });

        res.status(200).json(fullComment);
    } catch (e: any) {
        console.error('Failed to create comment:', e.message);
        res.status(500).json({ message: e.message });
    }
};

export const likeOrUnlikeComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.id;
    const userId = (req as any).user._id;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        const hasLiked = comment.likesBy.includes(userId);

        const updatedLikes = hasLiked
            ? comment.likesBy.filter(id => id !== userId)
            : [...comment.likesBy, userId];

        // Update likesBy array directly
        await Comment.update(
            { likesBy: updatedLikes },
            { where: { _id: commentId } }
        );

        // Update likeCount atomically
        await Comment.increment('likeCount', {
            by: hasLiked ? -1 : 1,
            where: {
                _id: commentId,
                ...(hasLiked && { likeCount: { [Op.gt]: 0 } }) // only decrement if > 0
            }
        });

        const updatedComment = await Comment.findByPk(commentId);
        res.status(200).json(updatedComment);
    } catch (e: any) {
        console.error(e.message);
        res.status(500).json({ message: e.message });
    }
};

export const hasLikedComment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.id;
    const userId = (req as any).user._id;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        const hasLiked = comment.likesBy.includes(userId);
        res.status(200).send(hasLiked);
    } catch (e: any) {
        console.error(e.message);
        res.status(500).json({ message: e.message });
    }
};



