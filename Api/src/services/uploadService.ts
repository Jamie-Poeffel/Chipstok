import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';


ffmpeg.setFfmpegPath(ffmpegStatic as string);

// Storage configuration
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/posts/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

// Profile picture storage
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/posts/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
})

// File filter for allowed types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const videoTypes = ['video/mp4', 'video/quicktime']; // .mov = video/quicktime

    if (imageTypes.includes(file.mimetype) || videoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'));
    }
};

const upload = multer({ storage: postStorage, fileFilter });
const profileUpload = multer({ storage: profilePictureStorage });

// Exported middleware
export const uploadMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    upload.fields([
        { name: 'photos', maxCount: 10 },
        { name: 'video', maxCount: 1 }
    ])(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            res.status(400).json({ error: err.message });
        } else if (err) {
            res.status(400).json({ error: err.message });
        } else {
            next();
        }
    });
};

export function createThumbnail(videoPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: ['2'],
                filename: path.basename(outputPath),
                folder: path.dirname(outputPath),
                size: '600x1200',
            })
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
}