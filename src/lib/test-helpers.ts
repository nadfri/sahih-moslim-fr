import { prisma } from "@/prisma/prisma";

/**
 * Clean up test data from the database
 * Use this in afterEach or beforeEach to ensure clean test environment
 */
export async function cleanupTestData() {
  // Delete in correct order to respect foreign key constraints
  await prisma.hadithTransmitter.deleteMany({
    where: {
      OR: [
        { hadith: { numero: { gte: 900000 } } }, // Test hadiths start at 900000
        { transmitter: { slug: { startsWith: "test-" } } },
      ],
    },
  });

  await prisma.hadith.deleteMany({
    where: {
      OR: [
        { numero: { gte: 900000 } }, // Test hadiths
        { chapter: { slug: { startsWith: "test-" } } },
        { narrator: { slug: { startsWith: "test-" } } },
      ],
    },
  });

  await prisma.chapter.deleteMany({
    where: { slug: { startsWith: "test-" } },
  });

  await prisma.narrator.deleteMany({
    where: { slug: { startsWith: "test-" } },
  });

  await prisma.sahaba.deleteMany({
    where: { slug: { startsWith: "test-" } },
  });

  await prisma.transmitter.deleteMany({
    where: { slug: { startsWith: "test-" } },
  });

  // Clean test profiles (keep system profiles)
  await prisma.profile.deleteMany({
    where: {
      AND: [
        { email: { contains: "test" } },
        { role: "USER" }, // Don't delete admin profiles
      ],
    },
  });
}

/**
 * Create test data with consistent naming convention
 * All test data uses "test-" prefix to be easily identifiable and cleanable
 */
export const testDataHelpers = {
  createTestChapter: (index: number) => ({
    name: `Test Chapter ${index}`,
    slug: `test-chapter-${index}`,
    index: 9000 + index, // Test chapters start at 9000
  }),

  createTestNarrator: (index: number) => ({
    name: `Test Narrator ${index}`,
    slug: `test-narrator-${index}`,
  }),

  createTestSahaba: (index: number) => ({
    name: `Test Sahaba ${index}`,
    slug: `test-sahaba-${index}`,
  }),

  createTestTransmitter: (index: number) => ({
    name: `Test Transmitter ${index}`,
    slug: `test-transmitter-${index}`,
  }),

  createTestHadith: (number: number) => ({
    numero: 900000 + number, // Test hadiths start at 900000
    matn_fr: `French text for test hadith ${number}`,
    matn_ar: `Arabic text for test hadith ${number}`,
  }),

  createTestProfile: (userId: string, role: "USER" | "ADMIN" = "USER") => ({
    id: userId,
    email: `test-user-${userId}@example.com`,
    name: `Test User ${userId}`,
    role,
  }),
};
