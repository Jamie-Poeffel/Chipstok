"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = exports.likePost = exports.getPosts = void 0;
const Posts_1 = require("../models/Posts");
const User_1 = require("../models/User");
const postService_1 = require("../services/postService");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const limit = parseInt(req.query.limit, 10) || 10;
        const likedHashtags = ((_a = user === null || user === void 0 ? void 0 : user.taste) === null || _a === void 0 ? void 0 : _a.likedHashtags) || [];
        const posts = yield Posts_1.Post.findAll();
        let viewedVideos = user.viewedVideos || [];
        if (posts.length === 0) {
            res.status(200).json({ message: "no posts posted" });
            return;
        }
        // Score all posts
        const scoredPosts = posts.map(post => {
            const postHashtags = post.Hashtags || [];
            const score = (0, postService_1.scorePostByHashtags)(postHashtags, post._id, likedHashtags, viewedVideos);
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
        let filledPosts = [...unviewedPosts];
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
        yield User_1.User.update({ viewedVideos }, { where: { _id: user._id } });
        const username = user.username || "Random User";
        res.status(200).json({ sortedPosts: finalPosts, username });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getPosts = getPosts;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield Posts_1.Post.findByPk(id);
        if (!post) {
            res.status(404).json({ message: "Post nicht gefunden" });
            return;
        }
        const user = req.user;
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
        yield User_1.User.update({ likedPosts: likedPosts, taste: Object.assign(Object.assign({}, taste), { likedHashtags: [...new Set(likedHashtags)] }) }, { where: { _id: userId } });
        post.likeCount += 1;
        yield post.save();
        res.status(200).json({ message: `Post ${id} wurde geliked.` });
    }
    catch (e) {
        console.error("Fehler beim Liken:", e);
        res.status(500).json({ message: "Fehler beim Liken", error: e.message });
    }
});
exports.likePost = likePost;
const getStream = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield Posts_1.Post.findByPk(id);
        const url = post === null || post === void 0 ? void 0 : post.URL;
        if (!url) {
            res.status(404).json({ message: "Video not found" });
            return;
        }
        const filePath = path_1.default.resolve(__dirname, `../public/posts/${url}`);
        const stat = yield fs_1.promises.stat(filePath);
        const fileSize = stat.size;
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:80");
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        });
        const stream = (0, fs_1.createReadStream)(filePath);
        stream.pipe(res);
        stream.on("end", () => {
            console.log(`Stream ended for file: ${filePath}`);
            stream.destroy();
            res.end();
        });
        stream.on("error", (err) => {
            console.error("Stream error:", err);
            stream.destroy();
            res.end();
        });
        req.on("close", () => __awaiter(void 0, void 0, void 0, function* () {
            if (!res.writableEnded) {
                stream.destroy();
                res.end();
            }
        }));
    }
    catch (err) {
        console.error("Error while streaming video:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});
exports.getStream = getStream;
