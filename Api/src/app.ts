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
const corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));

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
