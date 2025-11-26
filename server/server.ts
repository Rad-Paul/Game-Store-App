import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import express from 'express';

import gameRouter from './routers/game-router.js';

config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/games', gameRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});