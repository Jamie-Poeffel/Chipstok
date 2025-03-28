import { Request, RequestHandler, Response } from "express";
import { Post } from "../models/Posts";
import { Comments } from "../models/Comments";
import { User } from "../models/User";

export const getAllPosts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    Post.findAll()
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
}

export const newPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userid } = req.body;


        const newCommentsList = await Comments.create({});
        const commentListID = newCommentsList._id;


        const newPost = await Post.create({
            userid: userid,
            likeCount: 0,
            commentCount: 0,
            commentListID: commentListID,
            URL: "idk",
        });

        const user = await User.findByPk(userid);

        if (!user) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }

        const updatedPostedVideos = [...user.postedVideos, newPost._id];

        const updatedProfile = { ...user.profile, posts: user.profile.posts + 1 };

        await User.update(
            { postedVideos: updatedPostedVideos, profile: updatedProfile },
            { where: { _id: userid } }
        );

        res.status(201).json({
            message: "Post erfolgreich erstellt!",
            post: newPost
        });

    } catch (error) {
        console.error("Fehler beim Erstellen des Posts:", error);
        res.status(500).json({ message: "Interner Serverfehler", error });
    }
};

export const likePost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const post = await Post.findByPk(id);

        if (post) {
            post.likeCount = post.likeCount + 1;
            await post.save();  // This will trigger the @AfterUpdate hook
        }

        res.status(200).json({ id: id, message: id + " Liked" });
    } catch (e) {
        console.error(e)
    }
}