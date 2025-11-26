import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();

config();
const PORT = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});