// Script to fill slug fields for Chapter, Narrator, Sahaba

// Slugify utility (copied from src/utils/slugify.ts)
const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/--+/g, "-") // Avoid multiple dashes
    .trim();
};

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Fill Chapter slugs
  const chapters = await prisma.chapter.findMany();
  for (const chapter of chapters) {
    if (!chapter.slug) {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { slug: slugify(chapter.title) },
      });
    }
  }

  // Fill Narrator slugs
  const narrators = await prisma.narrator.findMany();
  for (const narrator of narrators) {
    if (!narrator.slug) {
      await prisma.narrator.update({
        where: { id: narrator.id },
        data: { slug: slugify(narrator.name) },
      });
    }
  }

  // Fill Sahaba slugs
  const sahabas = await prisma.sahaba.findMany();
  for (const sahaba of sahabas) {
    if (!sahaba.slug) {
      await prisma.sahaba.update({
        where: { id: sahaba.id },
        data: { slug: slugify(sahaba.name) },
      });
    }
  }
  console.log("Slugs filled!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
