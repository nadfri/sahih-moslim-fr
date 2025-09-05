import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { slugify } from "../src/utils/slugify";

const prisma = new PrismaClient();

async function main() {
  const srcPath = path.resolve(__dirname, "../backups/sahabas.json");
  const dstPath = path.resolve(__dirname, "../backups/sahabas_import.json");
  const data = JSON.parse(await fs.readFile(srcPath, "utf-8"));

  // Transform and save
  const transformed = data.map(
    (s: { name: string; nameArabic: string | null }) => ({
      name_fr: s.name,
      name_ar: s.nameArabic ?? "",
      slug: slugify(s.name),
    })
  );
  await fs.writeFile(dstPath, JSON.stringify(transformed, null, 2), "utf-8");

  // Delete all existing Sahabas before import
  await prisma.sahaba.deleteMany({});

  // Import into DB
  let success = 0;
  let failed = 0;
  for (const sahaba of transformed) {
    try {
      await prisma.sahaba.create({
        data: {
          name_fr: sahaba.name_fr,
          name_ar: sahaba.name_ar,
          slug: sahaba.slug,
        },
      });
      success++;
    } catch (err) {
      failed++;
      console.error(`Failed for slug: ${sahaba.slug}`, err);
    }
  }
  console.log(
    `Sahabas import finished. Success: ${success}, Failed: ${failed}`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
