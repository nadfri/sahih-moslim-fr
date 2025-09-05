import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { slugify } from "../src/utils/slugify";

const prisma = new PrismaClient();

async function main() {
  const srcPath = path.resolve(__dirname, "../backups/transmitters.json");
  const dstPath = path.resolve(
    __dirname,
    "../backups/transmitters_import.json"
  );
  const data = JSON.parse(await fs.readFile(srcPath, "utf-8"));

  // Transform and save
  const transformed = data.map(
    (t: { name: string; nameArabic: string | null }) => ({
      name_fr: t.name,
      name_ar: t.nameArabic ?? "",
      slug: slugify(t.name),
    })
  );
  await fs.writeFile(dstPath, JSON.stringify(transformed, null, 2), "utf-8");

  // Delete all existing Transmitters before import
  await prisma.transmitter.deleteMany({});

  // Import into DB
  let success = 0;
  let failed = 0;
  for (const transmitter of transformed) {
    try {
      await prisma.transmitter.create({
        data: {
          name_fr: transmitter.name_fr,
          name_ar: transmitter.name_ar,
          slug: transmitter.slug,
        },
      });
      success++;
    } catch (err) {
      failed++;
      console.error(`Failed for slug: ${transmitter.slug}`, err);
    }
  }
  console.log(
    `Transmitters import finished. Success: ${success}, Failed: ${failed}`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
