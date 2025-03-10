import express from 'express';

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
