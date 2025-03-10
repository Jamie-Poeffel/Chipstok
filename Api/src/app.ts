import express from 'express';
import UserRouter from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use('/users', UserRouter);
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
