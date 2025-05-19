import { RequestHandler } from "express";
import { Request, Response } from 'express';
import { User } from "../models/User";
import { Post } from "../models/Posts";

export const ProfileUpload: RequestHandler = async (req, res): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }

    res.status(200).json({
        message: 'Profile image uploaded successfully.',
        filename: req.file.filename,
        path: req.file.path
    });
}

export const PostUpload = async (req: Request, res: Response): Promise<void> => {
    const result: any = {
        message: 'Files uploaded successfully',
        files: {}
    };

    if (req.files && 'photos' in req.files) {
        const photoFiles = req.files['photos'] as Express.Multer.File[];
        result.files.photos = photoFiles.map(file => file.filename);
    }

    if (req.files && 'video' in req.files) {
        const videoFile = (req.files['video'] as Express.Multer.File[])[0];
        result.files.video = videoFile.filename;
    }
    try {
        const { Hashtags } = req.body;
        const user = (req as any).user;

        if (!user || !user._id) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }

        const userid = user._id;
        let newPost;
        if (req.files && 'video' in req.files) {
            newPost = await Post.create({
                likeCount: 0,
                commentCount: 0,
                userid: user._id,
                URL: req.files.video?.[0]?.filename || null,
                Hashtags: Hashtags || []
            });
        } else {
            newPost = await Post.create({
                likeCount: 0,
                commentCount: 0,
                userid: user._id,
                photos: result.files.photos.map((file: Express.Multer.File) => file.filename),
                Hashtags: Hashtags || []
            });

        }

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
            post: newPost,
            files: req.files
        });

    } catch (error) {
        console.error("Fehler beim Erstellen des Posts:", error);
        res.status(500).json({ message: "Interner Serverfehler", error });
    }
};
