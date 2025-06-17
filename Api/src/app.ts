import express from 'express';
import cors from 'cors';
import UserRouter from './routes/userRoutes';
import PostRouter from './routes/postRoutes';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import AuthRouter from './routes/authRoutes';
import OAuthRouter from './routes/oauthRoutes';
import UploadRouter from './routes/uploadRoutes';
import { config } from 'dotenv';
config();

const app = express();

const allowedOrigins = [
    'https://chipsytok.bbzwinf.ch',
    'https://chipslyfans.bbzwinf.ch',
    'https://www.chipsytok.bbzwinf.ch',
    'https://www.chipslyfans.bbzwinf.ch'
];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Nicht erlaubter Origin: ' + origin));
        }
    },
    credentials: true,
    exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/users', UserRouter);
app.use('/posts', PostRouter);
app.use('/auth', AuthRouter);
app.use('/oauth', OAuthRouter);
app.use('/upload', UploadRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
