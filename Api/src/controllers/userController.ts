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

export const isUserFollowing: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const username = req.params.username;
    const loggedInUser = (req as any).user;

    User.findOne({ where: { username } })
        .then((user) => {
            if (user) {
                const isFollowing = user?.followers?.includes(loggedInUser._id) ? true : false;
                res.status(200).json(isFollowing);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}

export const getUserByUsername: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const username = req.params.username;

    User.findOne({ where: { username } })
        .then((user) => {
            if (user) {
                const { passwordHash, followers, viewedVideos, likedPosts, taste, ...userData } = user.toJSON();
                res.status(200).json(userData);
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

    User.create(newUserData)
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
}

export const followUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const username = req.params.username;
    const loggedInUser = (req as any).user;

    User.findOne({ where: { username } })
        .then(async (user) => {
            if (user) {
                let followers = user?.followers || [];
                if (username === loggedInUser.username) {
                    res.status(400).json({ error: "You cannot follow yourself" });
                    return;
                }
                if (followers.includes(loggedInUser._id)) {
                    followers = followers?.filter((follower: string) => follower !== loggedInUser._id);
                } else {
                    followers?.push(loggedInUser._id);
                }

                user.followers = followers;
                user.profile.followers = followers.length;
                user.changed('followers', true);
                user.changed('profile', true);
                await user.save();

                User.findByPk(loggedInUser._id)
                    .then(async (l: any) => {
                        l.profile.following = followers.length;
                        l?.changed('profile', true);
                        await l?.save();
                    })

                res.status(200).json({ message: "User followed/unfollowed successfully" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}
