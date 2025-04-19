import express from 'express';
import UserRouter from './routes/userRoutes';
import PostRouter from './routes/postRoutes';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import AuthRouter from './routes/authRoutes';
import OAuthRouter from './routes/oauthRoutes';

const app = express();
const allowedOrigins: string[] = ['https://sub1.bbzwinf.ch', 'https://sub2.bbzwinf.ch'];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin as string)) {
        res.setHeader('Access-Control-Allow-Origin', (origin as string));
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});


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
