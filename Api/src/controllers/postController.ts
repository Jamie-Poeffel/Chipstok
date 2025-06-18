import { Request, RequestHandler, Response } from "express";
import { Post } from "../models/Posts";
import { User } from "../models/User";
import { scorePostByHashtags } from "../services/postService"
import { promises as fsPromises } from "fs";
import fs from "fs";
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
        const finPosts = filledPosts.slice(0, limit);
        const finalPosts: any[] = []

        finPosts.forEach(async (p) => {
            const u = await User.findByPk(p.userid);
            finalPosts.push({ post: p, username: u?.username });
        })



        // Update viewed video list
        const newPostIds = finalPosts.map(post => post.post._id);
        viewedVideos.push(...newPostIds);
        if (viewedVideos.length > 200) {
            viewedVideos = viewedVideos.slice(-200);
        }

        await User.update(
            { viewedVideos },
            { where: { _id: user._id } }
        );

        res.status(200).json({ sortedPosts: finalPosts });

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

export const isLiked: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const user = (req as any).user as unknown as User;

    res.status(200).json({ isLiked: user.likedPosts.includes(id) })
}
export const unlikePost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

        if (!likedPosts.includes(id)) {
            res.status(400).json({ message: "Post wurde nicht geliket" });
            return;
        }

        const updatedLikedPosts = likedPosts.filter(postId => postId !== id);

        const postHashtagsSet = new Set(post.Hashtags);
        const updatedLikedHashtags = likedHashtags.filter(ht => !postHashtagsSet.has(ht));

        await User.update(
            { likedPosts: updatedLikedPosts, taste: { ...taste, likedHashtags: updatedLikedHashtags } },
            { where: { _id: userId } }
        );

        post.likeCount = Math.max(post.likeCount - 1, 0);
        await post.save();

        res.status(200).json({ message: `Post ${id} wurde ungeliket.` });
    } catch (e) {
        console.error("Fehler beim Unliken:", e);
        res.status(500).json({ message: "Fehler beim Unliken", error: (e as Error).message });
    }
};


export const getStream: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const post = await Post.findByPk(id);
        const url = post?.URL;

        if (!url) {
            res.status(404).json({ message: "Video not found in DB" });
            return;
        }

        const filePath = path.resolve(__dirname, '..', 'public', 'posts', url);

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: "Video file not found on server", filePath });
            return;
        }

        const stat = await fsPromises.stat(filePath);
        const fileSize = stat.size;

        if (fileSize === 0) {
            res.status(204).json({ message: "Video file is empty" });
            return;
        }

        res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL ?? "*");
        res.setHeader("Cache-Control", "public, max-age=600");

        // Wenn kein Range-Header vorhanden ist: Ganze Datei senden


        const range = req.headers.range;
        if (!range) {
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes', // wichtig, auch wenn keine Range kommt
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }

        const CHUNK_SIZE = 10 ** 6; // 1MB
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);

        if (isNaN(start) || start < 0 || start >= fileSize) {
            res.status(416).json({ message: "Invalid start range" });
            return;
        }

        const requestedEnd = parts[1] ? parseInt(parts[1], 10) : undefined;
        let end = requestedEnd && !isNaN(requestedEnd) ? requestedEnd : start + CHUNK_SIZE - 1;
        end = Math.min(end, fileSize - 1);

        if (end < start) {
            res.status(416).json({ message: "Invalid end range" });
            return;
        }

        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);

        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);

        stream.on("error", (err) => {
            console.error("Stream error:", err);
            res.status(500).end();
        });

        req.on("close", () => {
            if (!res.writableEnded) {
                stream.destroy();
            }
        });

    } catch (err) {
        console.error("Error while streaming video:", err);
        res.status(500).json({ message: "Internal Server Error", error: (err as Error).message });
    }
};

// Example controller
export const getLikeStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.id;
    const userId = (req as any).user?.id;

    try {
        const user = await User.findByPk(userId);
        if (user?.likedPosts.includes(postId)) {
            res.status(200).json({ liked: true })
        }
        res.status(200).json({ liked: false });
    } catch (err) {
        console.error("Error checking like status:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const getThumbnail: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const post = await Post.findByPk(id);

        if (!post || !post.URL) {
            res.status(404).json({ message: 'Post not found or URL missing' });
            return;
        }

        const filename = path.basename(post.URL, path.extname(post.URL)); // e.g., "video"
        const thumbnailName = `${filename}.jpg`; // e.g., "video.jpg"
        const thumbnailPath = path.resolve(__dirname, '..', 'public', 'posts', 'thumbnails', thumbnailName);

        fs.readFile(thumbnailPath, (err, data) => {
            if (err) {
                console.error('Error reading thumbnail:', err);
                res.status(500).json({ error: 'Error reading file error: ' + (err as Error).message });
                return;
            }
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(data);
        });
    } catch (err) {
        console.error('Error while streaming video:', err);
        res.status(500).json({ message: 'Internal Server Error', error: (err as Error).message });
    }
};

export const getPostFile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const post = await Post.findByPk(id);

        if (!post || !post.URL) {
            res.status(404).json({ message: 'Post not found or URL missing' });
            return;
        }

        const videoPath = path.join(__dirname, '..', 'public', 'posts', post.URL);
        const stat = fs.statSync(videoPath);

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', stat.size.toString());
        res.setHeader('Content-Disposition', 'attachment; filename="sample.mp4"');

        const stream = fs.createReadStream(videoPath);
        stream.pipe(res);

    } catch (e: any) {
        console.error(e)
    }
}

export const getPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const post = await Post.findByPk(id);
        const user = await User.findByPk(post?.userid)
        if (post) {
            res.status(200).json({ post, username: user?.username });
            return
        } else {
            res.status(404).json(null);
            return
        }
    } catch (e: any) {
        console.error(e.message);
    }
}
