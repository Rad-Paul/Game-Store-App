import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

seed();

async function seed() {
    const genres = [
        {title: 'Action'},
        {title: 'Adventure'},
        {title: 'Singleplayer'},
        {title: 'Multiplayer'},
        {title: 'Cross-Platform'},
        {title: 'RPG'},
        {title: 'Strategy'},
        {title: 'Simulation'}
    ];

    try {
        for (const genre of genres){
            await prisma.genre.upsert({
                where: { 
                    id: genre.id,
                    title: genre.title
                },
                update: {},
                create: genre,
            })
        }
    }
    catch(e) {
        console.error(e);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}