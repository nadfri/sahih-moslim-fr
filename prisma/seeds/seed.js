// Prisma seed script to import data from hadiths-transformed.json and insert into Supabase
// Usage: npx prisma db seed
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  // Purge all tables before seeding
  await prisma.hadith.deleteMany();
  await prisma.transmitter.deleteMany();
  await prisma.sahaba.deleteMany();
  await prisma.chapter.deleteMany();

  // Import chapters
  const chapters = JSON.parse(
    fs.readFileSync("scripts/chapters.json", "utf-8")
  );
  for (const c of chapters) {
    await prisma.chapter.create({
      data: {
        ...c,
        createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
      },
    });
  }

  // Import sahabas
  const sahabas = JSON.parse(fs.readFileSync("scripts/sahabas.json", "utf-8"));
  for (const s of sahabas) {
    await prisma.sahaba.create({
      data: {
        ...s,
        createdAt: s.createdAt ? new Date(s.createdAt) : undefined,
        updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
      },
    });
  }

  // Import transmitters
  const transmitters = JSON.parse(
    fs.readFileSync("scripts/transmitters.json", "utf-8")
  );
  for (const t of transmitters) {
    await prisma.transmitter.create({
      data: {
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
      },
    });
  }

  // Import hadiths
  const hadiths = JSON.parse(fs.readFileSync("scripts/hadiths.json", "utf-8"));
  for (const h of hadiths) {
    const { narratorId, ...hadithData } = h;
    await prisma.hadith.create({
      data: {
        ...hadithData,
        matn_en: typeof h.matn_en === "string" ? h.matn_en : "",
        createdAt: h.createdAt ? new Date(h.createdAt) : undefined,
        updatedAt: h.updatedAt ? new Date(h.updatedAt) : undefined,
      },
    });
  }

  console.log("Seed terminé avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
