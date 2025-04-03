"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPost = exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Konfiguration für Profilbilder
const profileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile/'); // Speicherort für Profilbilder
    },
    filename: (req, file, cb) => {
        const userId = req.body.userId; // Benutzer-ID wird über den Request geschickt
        const extname = path_1.default.extname(file.originalname); // Dateiendung extrahieren
        cb(null, `${userId}${extname}`); // Dateiname = userId + Dateiendung
    }
});
// Konfiguration für Posts
const postStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/posts/'); // Speicherort für Post-Dateien
    },
    filename: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname); // Dateiendung extrahieren
        cb(null, `${Date.now()}${extname}`); // Dateiname = Zeitstempel + Dateiendung
    }
});
// Multer Upload-Initialisierung
const uploadProfile = (0, multer_1.default)({ storage: profileStorage });
exports.uploadProfile = uploadProfile;
const uploadPost = (0, multer_1.default)({ storage: postStorage });
exports.uploadPost = uploadPost;
