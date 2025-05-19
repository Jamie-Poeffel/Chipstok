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
exports.getStream = exports.likePost = exports.newPost = exports.getPosts = void 0;
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
        let viewdVideost = user.viewedVideos || [];
        const scoredPosts = posts.map(post => {
            const postHashtags = post.Hashtags || [];
            const score = (0, postService_1.scorePostByHashtags)(postHashtags, post._id, likedHashtags, viewdVideost);
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
        yield User_1.User.update({ viewedVideos: viewdVideost }, { where: { _id: user._id } });
        const username = user.username || "Random User";
        res.status(200).json({ sortedPosts, username });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getPosts = getPosts;
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { url, Hashtags } = req.body;
        const user = req.user;
        if (!user || !user._id) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }
        const userid = user._id;
        const newPost = yield Posts_1.Post.create({
            likeCount: 0,
            commentCount: 0,
            userid: user._id,
            URL: url,
            Hashtags: Hashtags || []
        });
        // Aktualisiere postedVideos und Profil
        const updatedPostedVideos = [...(user.postedVideos || []), newPost._id];
        const updatedProfile = Object.assign(Object.assign({}, user.profile), { posts: (((_a = user.profile) === null || _a === void 0 ? void 0 : _a.posts) || 0) + 1 });
        yield User_1.User.update({
            postedVideos: updatedPostedVideos,
            profile: updatedProfile
        }, { where: { _id: userid } });
        res.status(201).json({
            message: "Post erfolgreich erstellt!",
            post: newPost
        });
    }
    catch (error) {
        console.error("Fehler beim Erstellen des Posts:", error);
        res.status(500).json({ message: "Interner Serverfehler", error });
    }
});
exports.newPost = newPost;
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
        const url = yield Posts_1.Post.findByPk(id).then(e => e === null || e === void 0 ? void 0 : e.URL);
        const filePath = path_1.default.resolve(__dirname, `./../../public/posts/${url}`);
        // Get file stats
        const stat = yield fs_1.promises.stat(filePath);
        const fileSize = stat.size;
        // Set the appropriate headers for streaming the whole file
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4", // You can change this to match your file type
        });
        // Stream the whole video file (without Range header)
        const stream = (0, fs_1.createReadStream)(filePath);
        stream.pipe(res);
    }
    catch (err) {
        console.error("Error while streaming video:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});
exports.getStream = getStream;
