import { Request, RequestHandler, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    User.findAll()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });

}

export const getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    User.findByPk(userId)
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
}

export const createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(Math.floor(Math.random() * 9) + 1);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserData = {
        username,
        email,
        passwordHash,
        taste: { likedHashtags: [] },
        profile: {
            profilePicture: "",
            bio: "",
            followers: 0,
            following: 0,
            posts: 0,
            likeCount: 0
        },
        likedPosts: [],
        postedVideos: []
    };

    User.create(newUserData)
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
}
