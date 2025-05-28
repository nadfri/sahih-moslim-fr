const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const hadiths = await prisma.hadith.findMany({
      include: { Transmitter: true }
    });
    
    console.log('Found', hadiths.length, 'hadiths');
    
    for (const hadith of hadiths) {
      if (hadith.Transmitter.length > 0) {
        console.log('Migrating hadith', hadith.numero, 'with', hadith.Transmitter.length, 'transmitters');
        
        for (let i = 0; i < hadith.Transmitter.length; i++) {
          const transmitter = hadith.Transmitter[i];
          
          try {
            await prisma.hadithTransmitter.create({
              data: {
                hadithId: hadith.id,
                transmitterId: transmitter.id,
                order: i + 1
              }
            });
          } catch (error) {
            if (!error.message.includes('Unique constraint')) {
              throw error;
            }
          }
        }
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.disconnect();
  }
}

run();
