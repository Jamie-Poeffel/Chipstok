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
exports.getStream = exports.likePost = exports.newPost = exports.getAllPosts = void 0;
const Posts_1 = require("../models/Posts");
const Comments_1 = require("../models/Comments");
const User_1 = require("../models/User");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit, 10) || 10;
    const posts = yield Posts_1.Post.findAll({ limit });
    res.status(200).json(posts);
});
exports.getAllPosts = getAllPosts;
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid, url } = req.body;
        const newCommentsList = yield Comments_1.Comments.create({});
        const commentListID = newCommentsList._id;
        const newPost = yield Posts_1.Post.create({
            userid: userid,
            likeCount: 0,
            commentCount: 0,
            commentListID: commentListID,
            Hashtags: [],
            URL: url,
        });
        const user = yield User_1.User.findByPk(userid);
        if (!user) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }
        const updatedPostedVideos = [...user.postedVideos, newPost._id];
        const updatedProfile = Object.assign(Object.assign({}, user.profile), { posts: user.profile.posts + 1 });
        yield User_1.User.update({ postedVideos: updatedPostedVideos, profile: updatedProfile }, { where: { _id: userid } });
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
        if (post) {
            post.likeCount = post.likeCount + 1;
            yield post.save(); // This will trigger the @AfterUpdate hook
        }
        res.status(200).json({ id: id, message: id + " Liked" });
    }
    catch (e) {
        console.error(e);
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
