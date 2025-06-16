import multer from 'multer';
import path from 'path';
const { v4: uuidv4 } = require('uuid');

// Konfiguration für Profilbilder
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile/'); // Speicherort für Profilbilder
    },
    filename: (req, file, cb) => {
        const userId = (req as any).userId;
        const extname = path.extname(file.originalname);
        cb(null, `${uuidv4()}${extname}`);
    }
});

// Konfiguration für Posts
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/../public/posts/'); // Speicherort für Post-Dateien
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${uuidv4()}${extname}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/mov'];

    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

// Multer Upload-Initialisierung
const uploadProfile = multer({ storage: profileStorage });
const uploadPost = multer({ storage: postStorage });

export { uploadProfile, uploadPost };
