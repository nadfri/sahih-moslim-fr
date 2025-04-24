/* eslint-disable import/extensions */
import { PrismaClient } from "@prisma/client";

import { chapters } from "../db/chapters.js";
import { moslim_fr } from "../db/moslim_fr.js";
import { narrators } from "../db/narrators.js";
import { sahabas } from "../db/sahabas.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  try {
    // Seed Sahabas
    console.log("Seeding sahabas...");

    // First, check existing sahabas to avoid duplicates
    const existingSahabas = await prisma.sahaba.findMany({
      select: { name: true, id: true },
    });
    const existingSahabaNames = new Set(existingSahabas.map((s) => s.name));
    const sahabasMap = new Map(existingSahabas.map((s) => [s.name, s.id]));

    // Filter out sahabas that already exist
    const newSahabas = sahabas.filter((name) => !existingSahabaNames.has(name));

    if (newSahabas.length > 0) {
      // Create sahabas (only new ones)
      const sahabasData = newSahabas.map((name) => ({
        name,
      }));

      // Insert new sahabas
      const sahabasResult = await prisma.sahaba.createMany({
        data: sahabasData,
      });

      console.log(`✅ Successfully seeded ${sahabasResult.count} new sahabas`);

      // Update our map with newly created sahabas
      const newlyCreatedSahabas = await prisma.sahaba.findMany({
        where: { name: { in: newSahabas } },
        select: { name: true, id: true },
      });

      newlyCreatedSahabas.forEach((s) => sahabasMap.set(s.name, s.id));
    } else {
      console.log("ℹ️ No new sahabas to seed - all already exist in database");
    }

    // Seed Narrators
    console.log("Seeding narrators...");

    // First, check existing narrators to avoid duplicates
    const existingNarrators = await prisma.narrator.findMany({
      select: { name: true, id: true },
    });
    const existingNarratorNames = new Set(existingNarrators.map((n) => n.name));
    const narratorsMap = new Map(existingNarrators.map((n) => [n.name, n.id]));

    // Filter out narrators that already exist
    const newNarrators = narrators.filter(
      (name) => !existingNarratorNames.has(name)
    );

    if (newNarrators.length > 0) {
      // Create narrators (only new ones)
      const narratorsData = newNarrators.map((name) => ({
        name,
      }));

      // Insert new narrators
      const narratorsResult = await prisma.narrator.createMany({
        data: narratorsData,
      });

      console.log(
        `✅ Successfully seeded ${narratorsResult.count} new narrators`
      );

      // Update our map with newly created narrators
      const newlyCreatedNarrators = await prisma.narrator.findMany({
        where: { name: { in: newNarrators } },
        select: { name: true, id: true },
      });

      newlyCreatedNarrators.forEach((n) => narratorsMap.set(n.name, n.id));
    } else {
      console.log(
        "ℹ️ No new narrators to seed - all already exist in database"
      );
    }

    // Seed Chapters
    console.log("Seeding chapters...");

    // First, check existing chapters to avoid duplicates
    const existingChapters = await prisma.chapter.findMany({
      select: { title: true, id: true },
    });
    const existingChapterTitles = new Set(existingChapters.map((c) => c.title));
    const chaptersMap = new Map(existingChapters.map((c) => [c.title, c.id]));

    // Filter out chapters that already exist
    const newChapters = chapters.filter(
      (title) => !existingChapterTitles.has(title)
    );

    if (newChapters.length > 0) {
      // Create chapters (only new ones)
      const chaptersData = newChapters.map((title) => ({
        title,
      }));

      // Insert new chapters
      const chaptersResult = await prisma.chapter.createMany({
        data: chaptersData,
      });

      console.log(
        `✅ Successfully seeded ${chaptersResult.count} new chapters`
      );

      // Update our map with newly created chapters
      const newlyCreatedChapters = await prisma.chapter.findMany({
        where: { title: { in: newChapters } },
        select: { title: true, id: true },
      });

      newlyCreatedChapters.forEach((c) => chaptersMap.set(c.title, c.id));
    } else {
      console.log("ℹ️ No new chapters to seed - all already exist in database");
    }

    // Seed Hadiths
    console.log("Seeding hadiths...");

    // Check existing hadiths
    const existingHadiths = await prisma.hadith.findMany({
      select: { numero: true },
    });
    const existingHadithNumeros = new Set(existingHadiths.map((h) => h.numero));

    // Filter hadiths that are not already in the database
    const newHadiths = moslim_fr.filter(
      (hadith) => !existingHadithNumeros.has(hadith.numero)
    );

    if (newHadiths.length > 0) {
      let successCount = 0;

      // We need to create hadiths one by one due to the many-to-many relationship with sahabas
      for (const hadith of newHadiths) {
        try {
          // Find the chapter ID
          const chapterId = chaptersMap.get(hadith.chapter);
          if (!chapterId) {
            console.error(
              `❌ Chapter "${hadith.chapter}" not found for hadith #${hadith.numero}`
            );
            continue;
          }

          // Find the narrator ID
          const narratorId = narratorsMap.get(hadith.narrator);
          if (!narratorId) {
            console.error(
              `❌ Narrator "${hadith.narrator}" not found for hadith #${hadith.numero}`
            );
            continue;
          }

          // Create the hadith with its connections to sahabas
          await prisma.hadith.create({
            data: {
              numero: hadith.numero,
              matn_fr: hadith.matn_fr,
              matn_ar: hadith.matn_ar,
              isnad: hadith.isnad || "",
              chapter: {
                connect: { id: chapterId },
              },
              narrator: {
                connect: { id: narratorId },
              },
              mentionedSahabas: {
                connect: hadith.sahabas
                  .map((sahabaName) => {
                    const sahabaId = sahabasMap.get(sahabaName);
                    if (!sahabaId) {
                      console.warn(
                        `⚠️ Sahaba "${sahabaName}" not found for hadith #${hadith.numero}`
                      );
                    }
                    return { id: sahabaId };
                  })
                  .filter((connection) => connection.id), // Filter out undefined ids
              },
            },
          });

          successCount++;
        } catch (error) {
          console.error(`❌ Error seeding hadith #${hadith.numero}:`, error);
        }
      }

      console.log(`✅ Successfully seeded ${successCount} new hadiths`);
    } else {
      console.log("ℹ️ No new hadiths to seed - all already exist in database");
    }

    console.log("✅ Database seeding completed successfully");
  } catch (error) {
    if (error.code === "P2021") {
      console.error(
        "❌ Database tables don't exist yet. Please run a migration first:"
      );
      console.error("   pnpm prisma:migrate");
    } else {
      console.error("❌ Error during seeding:", error);
    }
    process.exit(1);
  }
}

main().finally(async () => {
  // Close the database connection
  await prisma.$disconnect();
});
