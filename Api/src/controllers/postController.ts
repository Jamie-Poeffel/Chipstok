import { Request, RequestHandler, Response } from "express";
import { Post } from "../models/Posts";
import { Comments } from "../models/Comments";
import { User } from "../models/User";
import { createReadStream, promises as fsPromises } from "fs";
import path from "path";



export const getAllPosts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const posts = await Post.findAll({ limit });
    res.status(200).json(posts);
}

export const newPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userid, url } = req.body;


        const newCommentsList = await Comments.create({});
        const commentListID = newCommentsList._id;


        const newPost = await Post.create({
            userid: userid,
            likeCount: 0,
            commentCount: 0,
            commentListID: commentListID,
            Hashtags: [],
            URL: url,
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


export const getStream: RequestHandler = async (req: Request, res: Response): Promise<void> => {

    const id = req.params.id
    try {
        const url = await Post.findByPk(id).then(e => e?.URL);
        const filePath = path.resolve(__dirname, `./../../public/posts/${url}`);

        // Get file stats
        const stat = await fsPromises.stat(filePath);
        const fileSize = stat.size;

        // Set the appropriate headers for streaming the whole file
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",  // You can change this to match your file type
        });

        // Stream the whole video file (without Range header)
        const stream = createReadStream(filePath);
        stream.pipe(res);

    } catch (err) {
        console.error("Error while streaming video:", err);
        res.status(500).json({ message: "Internal Server Error", error: (err as Error).message });
    }
};
