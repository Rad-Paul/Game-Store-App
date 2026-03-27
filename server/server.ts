import { config } from 'dotenv';

config();

import express from 'express';
import gameRouter from './routers/game-router.ts';
import genreRouter from './routers/genre-router.ts';
import authRouter from './routers/auth.router.ts';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/games', gameRouter);

app.use('/genres', genreRouter);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});