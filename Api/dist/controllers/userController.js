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
exports.createUser = exports.getUserByUsername = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.User.findAll()
        .then((users) => {
        res.status(200).json(users);
    })
        .catch((error) => {
        res.status(500).json({ error: error });
    });
});
exports.getAllUsers = getAllUsers;
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    User_1.User.findOne({ where: { username } })
        .then((user) => {
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    })
        .catch((error) => {
        res.status(500).json({ error: error });
    });
});
exports.getUserByUsername = getUserByUsername;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const salt = yield bcryptjs_1.default.genSalt(Math.floor(Math.random() * 9) + 1);
    const passwordHash = yield bcryptjs_1.default.hash(password, salt);
    const newUserData = {
        username,
        email,
        passwordHash,
        taste: { likedHashtags: [] },
        profile: {
            profilePicture: "",
            bio: "Hello i am new to Chipsytok",
            followers: 0,
            following: 0,
            posts: 0,
            likeCount: 0
        },
        likedPosts: [],
        postedVideos: [],
        emailVeryfied: false,
        viewedVideos: [],
    };
    User_1.User.create(newUserData)
        .then((user) => {
        res.status(201).json(user);
    })
        .catch((error) => {
        res.status(500).json({ error: error });
    });
});
exports.createUser = createUser;
