import prisma from "../utils/prisma-client.ts";

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