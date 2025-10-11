// Script to insert/update chapters into the database from datas/chaptersName.json
// Usage: node scripts/importChapters.js

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Slugify function copied from src/utils/slugify.ts (JS version)
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/--+/g, "-") // Avoid multiple dashes
    .trim();
}
const prisma = new PrismaClient();

async function main() {
  const chaptersPath = path.join(__dirname, "../datas/chaptersName.json");
  const chapters = JSON.parse(fs.readFileSync(chaptersPath, "utf-8"));

  for (const c of chapters) {
    const baseSlug = slugify(c.chapterName_fr);
    let slug = baseSlug;

    // Try upsert by unique index; if slug conflicts, append -{index}
    try {
      await prisma.chapter.upsert({
        where: { index: c.number },
        create: {
          index: c.number,
          slug,
          name_fr: c.chapterName_fr,
          name_en: c.chapterName_en,
          name_ar: c.chapterName_ar,
        },
        update: {
          slug,
          name_fr: c.chapterName_fr,
          name_en: c.chapterName_en,
          name_ar: c.chapterName_ar,
        },
      });
    } catch (err) {
      if (err && err.code === "P2002" && err.meta?.target?.includes("slug")) {
        slug = `${baseSlug}-${c.number}`;
        await prisma.chapter.upsert({
          where: { index: c.number },
          create: {
            index: c.number,
            slug,
            name_fr: c.chapterName_fr,
            name_en: c.chapterName_en,
            name_ar: c.chapterName_ar,
          },
          update: {
            slug,
            name_fr: c.chapterName_fr,
            name_en: c.chapterName_en,
            name_ar: c.chapterName_ar,
          },
        });
      } else {
        throw err;
      }
    }
    console.log(`Upserted: ${c.number} - ${c.chapterName_fr}`);
  }
  console.log("Import terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
