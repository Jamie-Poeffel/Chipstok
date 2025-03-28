import express from 'express';
import UserRouter from './routes/userRoutes';
import PostRouter from './routes/postRoutes';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import AuthRouter from './routes/authRoutes';
import cors from 'cors'

const app = express();
const corsOptions = {
    origin: ['http://localhost', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use('/users', UserRouter);
app.use('/posts', PostRouter);
app.use('/auth', AuthRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
