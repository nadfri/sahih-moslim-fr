import { prisma } from "@/prisma/prisma";
import { randomUUID } from "crypto";

/**
 * Clean up test data from the database
 * Use this in afterEach or beforeEach to ensure clean test environment
 */
export async function cleanupTestData() {
  // Safety gate: refuse to run dangerous cleanup when running against production
  // unless explicitly allowed via env var. This protects accidental wipes.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_LARGE_CLEANUP !== "true"
  ) {
    throw new Error(
      "Refusing to run test cleanup in production environment without explicit ALLOW_LARGE_CLEANUP=true"
    );
  }

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
  createTestChapter: (index: number) => {
    const uid = randomUUID();
    return {
      name: `Test Chapter ${index}-${uid}`,
      slug: `test-chapter-${index}-${uid}`,
      // Use a large random index to avoid collisions
      index: 900000 + Math.floor(Math.random() * 900000),
    };
  },

  createTestNarrator: (index: number) => {
    const uid = randomUUID();
    return {
      name: `Test Narrator ${index}-${uid}`,
      slug: `test-narrator-${index}-${uid}`,
    };
  },

  createTestSahaba: (index: number) => {
    const uid = randomUUID();
    return {
      name: `Test Sahaba ${index}-${uid}`,
      slug: `test-sahaba-${index}-${uid}`,
    };
  },

  createTestTransmitter: (index: number) => {
    const uid = randomUUID();
    return {
      name: `Test Transmitter ${index}-${uid}`,
      slug: `test-transmitter-${index}-${uid}`,
    };
  },

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
