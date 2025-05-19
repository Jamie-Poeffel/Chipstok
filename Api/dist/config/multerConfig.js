"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPost = exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const { v4: uuidv4 } = require('uuid');
// Konfiguration für Profilbilder
const profileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile/'); // Speicherort für Profilbilder
    },
    filename: (req, file, cb) => {
        const userId = req.userId;
        const extname = path_1.default.extname(file.originalname);
        cb(null, `${uuidv4()}${extname}`);
    }
});
// Konfiguration für Posts
const postStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/posts/'); // Speicherort für Post-Dateien
    },
    filename: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname);
        cb(null, `${uuidv4()}${extname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/mov'];
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Unsupported file type'), false);
    }
};
// Multer Upload-Initialisierung
const uploadProfile = (0, multer_1.default)({ storage: profileStorage });
exports.uploadProfile = uploadProfile;
const uploadPost = (0, multer_1.default)({ storage: postStorage });
exports.uploadPost = uploadPost;
