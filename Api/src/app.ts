import express from 'express';
import UserRouter from './routes/userRoutes';
import PostRouter from './routes/postRoutes';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import AuthRouter from './routes/authRoutes';
import cors from 'cors'
import OAuthRouter from './routes/oauthRoutes';

const isDev = process.env.NODE_ENV !== 'production';
const app = express();
const corsOptions = {
    origin: isDev ? true : 'https://Chipsytok.bbzwinf.ch',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/users', UserRouter);
app.use('/posts', PostRouter);
app.use('/auth', AuthRouter);
app.use('/oauth', OAuthRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
