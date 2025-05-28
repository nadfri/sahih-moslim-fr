const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrateTransmitters() {
  console.log("Starting transmitter migration...");

  try {
    // Get all hadiths with their transmitters using the current relation
    const hadiths = await prisma.hadith.findMany({
      include: {
        Transmitter: true, // Current many-to-many relation
      },
    });

    console.log(`Found ${hadiths.length} hadiths to migrate`);

    // For each hadith, create ordered HadithTransmitter records
    for (const hadith of hadiths) {
      if (hadith.Transmitter.length > 0) {
        console.log(
          `Migrating hadith ${hadith.numero} with ${hadith.Transmitter.length} transmitters`
        );

        // Create HadithTransmitter records with order
        for (let i = 0; i < hadith.Transmitter.length; i++) {
          const transmitter = hadith.Transmitter[i];

          try {
            await prisma.hadithTransmitter.create({
              data: {
                hadithId: hadith.id,
                transmitterId: transmitter.id,
                order: i + 1, // Start order from 1
              },
            });
          } catch (error) {
            // Skip if already exists (unique constraint)
            if (!error.message.includes("Unique constraint")) {
              throw error;
            }
          }
        }
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateTransmitters();
