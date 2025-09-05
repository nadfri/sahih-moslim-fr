import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.resolve(__dirname, "../backups/chapters.json");
  const data = JSON.parse(await fs.readFile(filePath, "utf-8"));

  let success = 0;
  let failed = 0;

  for (const chapter of data) {
    try {
      await prisma.chapter.upsert({
        where: { slug: chapter.slug },
        update: {
          index: chapter.index,
          name_fr: chapter.name_fr,
          name_ar: chapter.name_ar ?? "",
          name_en: chapter.name_en ?? "",
        },
        create: {
          index: chapter.index,
          name_fr: chapter.name_fr,
          name_ar: chapter.name_ar ?? "",
          name_en: chapter.name_en ?? "",
          slug: chapter.slug,
        },
      });
      success++;
    } catch (err) {
      failed++;
      // Minimal error log
      console.error(`Failed for slug: ${chapter.slug}`, err);
    }
  }

  console.log(`Import finished. Success: ${success}, Failed: ${failed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
