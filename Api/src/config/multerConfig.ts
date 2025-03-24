import multer from 'multer';
import path from 'path';

// Konfiguration für Profilbilder
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile/'); // Speicherort für Profilbilder
    },
    filename: (req, file, cb) => {
        const userId = req.body.userId; // Benutzer-ID wird über den Request geschickt
        const extname = path.extname(file.originalname); // Dateiendung extrahieren
        cb(null, `${userId}${extname}`); // Dateiname = userId + Dateiendung
    }
});

// Konfiguration für Posts
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/posts/'); // Speicherort für Post-Dateien
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname); // Dateiendung extrahieren
        cb(null, `${Date.now()}${extname}`); // Dateiname = Zeitstempel + Dateiendung
    }
});

// Multer Upload-Initialisierung
const uploadProfile = multer({ storage: profileStorage });
const uploadPost = multer({ storage: postStorage });

export { uploadProfile, uploadPost };
