import { Request, Response, RequestHandler } from "express";
import { Post } from "../models/Posts";

export const getComments: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { offset, limit } = req.query as unknown as { offset: number, limit: number }

    try {
        const post = await Post.findByPk(id) as Post;

        let max = offset + limit;
        max > post?.comments.length ? max = post?.comments.length : max = max

        const out = post?.comments.splice(offset, max)

        res.status(200).json(out);
        return;
    } catch (e: any) {
        console.error(e.message);
        res.status(500).json(e);
        return;
    }
}