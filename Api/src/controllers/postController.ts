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
        let viewedVideos = user.viewedVideos || [];

        if (posts.length === 0) {
            res.status(200).json({ message: "no posts posted" })
            return;
        }

        // Score all posts
        const scoredPosts = posts.map(post => {
            const postHashtags = post.Hashtags || [];
            const score = scorePostByHashtags(postHashtags, post._id, likedHashtags, viewedVideos);
            return { post, score };
        });

        // Sort by score
        const sortedPosts = scoredPosts
            .sort((a, b) => b.score - a.score)
            .map(item => item.post);

        const viewedSet = new Set(viewedVideos);
        const unviewedPosts = sortedPosts.filter(post => !viewedSet.has(post._id));
        const viewedPosts = sortedPosts.filter(post => viewedSet.has(post._id));

        // Fill with unviewed first
        let filledPosts: typeof sortedPosts = [...unviewedPosts];

        // Add viewed posts if needed
        if (filledPosts.length < limit) {
            const remaining = limit - filledPosts.length;
            filledPosts.push(...viewedPosts.slice(0, remaining));
        }

        // Still not enough? Repeat posts to fill the rest
        if (filledPosts.length < limit) {
            const allPosts = [...filledPosts, ...viewedPosts]; // total pool to repeat from
            let i = 0;
            while (filledPosts.length < limit) {
                filledPosts.push(allPosts[i % allPosts.length].toJSON());
                i++;
            }
        }

        // Final slice to ensure limit
        const finalPosts = filledPosts.slice(0, limit);

        // Update viewed video list
        const newPostIds = finalPosts.map(post => post._id);
        viewedVideos.push(...newPostIds);
        if (viewedVideos.length > 200) {
            viewedVideos = viewedVideos.slice(-200);
        }

        await User.update(
            { viewedVideos },
            { where: { _id: user._id } }
        );

        const username = user.username || "Random User";

        res.status(200).json({ sortedPosts: finalPosts, username });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
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
    const id = req.params.id;

    try {
        const post = await Post.findByPk(id);
        const url = post?.URL;

        if (!url) {
            res.status(404).json({ message: "Video not found" });
            return;
        }

        const filePath = path.resolve(__dirname, `../../public/posts/${url}`);

        const stat = await fsPromises.stat(filePath);
        const fileSize = stat.size;
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:80");

        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        });

        const stream = createReadStream(filePath);

        stream.pipe(res);

        stream.on("end", () => {
            console.log(`Stream ended for file: ${filePath}`);
            stream.destroy()
            res.end();
        });

        stream.on("error", (err) => {
            console.error("Stream error:", err);
            stream.destroy();
            res.end();
        });

        req.on("close", async () => {
            if (!res.writableEnded) {
                stream.destroy();
                res.end()
            }
        });

    } catch (err) {
        console.error("Error while streaming video:", err);
        res.status(500).json({ message: "Internal Server Error", error: (err as Error).message });
    }
};
