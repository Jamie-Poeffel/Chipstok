import express from 'express';
import UserRouter from './routes/userRoutes';
import { connectDB } from './config/db';

const app = express();

app.use(express.json());
app.use('/users', UserRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export default app;
