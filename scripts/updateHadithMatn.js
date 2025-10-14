const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Function to clean Arabic text from invisible characters
function cleanArabicText(text) {
  if (!text) {
    return "";
  }

  let cleanedText = text;

  // 1. Remove zero-width characters
  cleanedText = cleanedText.replace(/[\u200B-\u200F\uFEFF]/gi, "");

  // 2. Remove Tatweel
  cleanedText = cleanedText.replace(/\u0640/gi, "");

  // 3. Remove specific quotes
  cleanedText = cleanedText.replace(/["'«»]/g, "");

  // 4. Normalize Non-Breaking Space (NBSP) to standard space
  cleanedText = cleanedText.replace(/\u00A0/g, " ");

  // 5. Collapse multiple consecutive standard spaces into a single standard space
  cleanedText = cleanedText.replace(/ +/g, " ");

  // 6. Remove a single standard space specifically before the target punctuation marks
  cleanedText = cleanedText.replace(/ ([،.:;؟])/g, "$1");

  // 7. Trim leading/trailing whitespace
  cleanedText = cleanedText.trim();

  return cleanedText;
}

async function updateHadithMatn() {
  try {
    console.log("🚀 Starting hadith matn update...");

    // Read the JSON file containing the hadith data
    const dataPath = path.join(process.cwd(), "datas", "muslim_book1.json");
    const rawData = fs.readFileSync(dataPath, "utf8");
    const hadithData = JSON.parse(rawData);

    console.log(`📖 Found ${hadithData.length} hadiths in the JSON file`);

    // Find the chapter for "Book of Faith" (index 1)
    const chapter = await prisma.chapter.findUnique({
      where: { index: 1 },
    });

    if (!chapter) {
      throw new Error("Chapter 1 (Book of Faith) not found in database");
    }

    console.log(`📚 Found chapter: ${chapter.name_fr} (ID: ${chapter.id})`);

    let updatedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;

    // Process each hadith in the JSON data
    for (const hadithEntry of hadithData) {
      const { numero, matn_en, matn_ar } = hadithEntry;

      // Skip if missing required fields
      if (!numero || !matn_en || !matn_ar) {
        console.log(`⚠️ Skipping hadith ${numero}: missing matn_en or matn_ar`);
        skippedCount++;
        continue;
      }

      try {
        // Find the existing hadith by numero
        const existingHadith = await prisma.hadith.findUnique({
          where: { numero: numero },
        });

        if (!existingHadith) {
          // Create new hadith with empty matn_fr
          await prisma.hadith.create({
            data: {
              numero: numero,
              matn_fr: "", // Empty string for French translation
              matn_ar: cleanArabicText(matn_ar),
              matn_en: matn_en.trim(),
              chapterId: chapter.id,
            },
          });

          createdCount++;
          console.log(`✨ Created hadith ${numero}`);
        } else {
          // Update existing hadith with matn_en and matn_ar
          await prisma.hadith.update({
            where: { numero: numero },
            data: {
              matn_en: matn_en.trim(),
              matn_ar: cleanArabicText(matn_ar),
              updatedAt: new Date(),
            },
          });

          updatedCount++;
          console.log(`✅ Updated hadith ${numero}`);
        }
      } catch (error) {
        console.error(`❌ Error processing hadith ${numero}:`, error.message);
      }
    }

    console.log("\n📊 Update Summary:");
    console.log(`✨ Successfully created: ${createdCount} new hadiths`);
    console.log(`✅ Successfully updated: ${updatedCount} existing hadiths`);
    console.log(`⚠️ Skipped (missing data): ${skippedCount} hadiths`);
    console.log(`📝 Total processed: ${hadithData.length} hadiths`);
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update script
updateHadithMatn()
  .then(() => {
    console.log("🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
