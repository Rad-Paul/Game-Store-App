import { config } from 'dotenv';

config();

import express from 'express';
import gameRouter from './routers/game-router.ts';
import genreRouter from './routers/genre-router.ts';
import authRouter from './routers/auth.router.ts';
import { authenticate } from './middlewares/auth.middleware.ts';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/games', authenticate, gameRouter);
app.use('/genres', authenticate, genreRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});