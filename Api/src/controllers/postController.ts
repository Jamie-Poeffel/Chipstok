import { Request, RequestHandler, Response } from "express";
import { Post } from "../models/Posts";
import { User } from "../models/User";
import { scorePostByHashtags } from "../services/postService"
import { createReadStream, promises as fsPromises } from "fs";
import path from "path";



export const getPosts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user as unknown as User;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        const likedHashtags = user?.taste?.likedHashtags || [];

        const posts = await Post.findAll();

        let viewdVideost = user.viewedVideos || [];

        const scoredPosts = posts.map(post => {
            const postHashtags = post.Hashtags || [];
            const score = scorePostByHashtags(postHashtags, post._id, likedHashtags, viewdVideost);
            return { post, score };
        });


        const sortedPosts = scoredPosts
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.post);

        const viewedSet = new Set(viewdVideost);

        const newPostIds = sortedPosts
            .filter(post => !viewedSet.has(post._id))
            .map(post => post._id);

        viewdVideost.push(...newPostIds);

        if (viewdVideost.length > 200) {
            viewdVideost = viewdVideost.slice(-200); // Behalte nur die letzten 200 IDs
        }

        await User.update(
            { viewedVideos: viewdVideost },
            { where: { _id: user._id } }
        );
        const username = user.username || "Random User";


        res.status(200).json({ sortedPosts, username });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
};

export const newPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { url, Hashtags } = req.body;
        const user = (req as any).user;

        if (!user || !user._id) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }

        const userid = user._id;

        const newPost = await Post.create({
            likeCount: 0,
            commentCount: 0,
            userid: user._id,
            URL: url,
            Hashtags: Hashtags || []
        });

        // Aktualisiere postedVideos und Profil
        const updatedPostedVideos = [...(user.postedVideos || []), newPost._id];
        const updatedProfile = {
            ...user.profile,
            posts: (user.profile?.posts || 0) + 1
        };

        await User.update(
            {
                postedVideos: updatedPostedVideos,
                profile: updatedProfile
            },
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

        if (!post) {
            res.status(404).json({ message: "Post nicht gefunden" });
            return;
        }
        const user = (req as any).user as unknown as User;
        const userId = user._id;

        const likedPosts = user.likedPosts || [];
        const taste = user.taste || { likedHashtags: [] };
        const likedHashtags = taste.likedHashtags || [];
        if (likedPosts.includes(id)) {
            res.status(400).json({ message: "Post wurde bereits geliket" });
            return;
        }

        likedHashtags.push(...post.Hashtags);
        likedPosts.push(id);
        await User.update(
            { likedPosts: likedPosts, taste: { ...taste, likedHashtags: [...new Set(likedHashtags)] } },
            { where: { _id: userId } }
        );

        post.likeCount += 1;
        await post.save();

        res.status(200).json({ message: `Post ${id} wurde geliked.` });
    } catch (e) {
        console.error("Fehler beim Liken:", e);
        res.status(500).json({ message: "Fehler beim Liken", error: (e as Error).message });
    }
};



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
