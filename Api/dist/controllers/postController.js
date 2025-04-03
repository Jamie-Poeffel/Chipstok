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
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.newPost = exports.getAllPosts = void 0;
const Posts_1 = require("../models/Posts");
const Comments_1 = require("../models/Comments");
const User_1 = require("../models/User");
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Posts_1.Post.findAll()
        .then((posts) => {
        res.status(200).json(posts);
    })
        .catch((error) => {
        res.status(500).json({ error: error });
    });
});
exports.getAllPosts = getAllPosts;
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid } = req.body;
        const newCommentsList = yield Comments_1.Comments.create({});
        const commentListID = newCommentsList._id;
        const newPost = yield Posts_1.Post.create({
            userid: userid,
            likeCount: 0,
            commentCount: 0,
            commentListID: commentListID,
            URL: "idk",
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
