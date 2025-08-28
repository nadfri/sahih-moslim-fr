import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { cleanupTestData, testDataHelpers } from "@/__tests__/test-helpers";
import { addHadith, deleteHadith, editHadith } from "@/src/services/actions";

// Mock auth to always allow admin
vi.mock("@/src/lib/auth/auth", () => ({
  requireAdmin: vi.fn().mockResolvedValue(true),
}));

describe("Actions (hadith)", () => {
  beforeEach(async () => {
    // Clean up before each test
    await cleanupTestData();
  });

  describe("addHadith", () => {
    it("should create a hadith with valid data", async () => {
      // Create test dependencies
      const chapter = await prisma.chapter.create({
        data: testDataHelpers.createTestChapter(1),
      });

      const narrator = await prisma.narrator.create({
        data: testDataHelpers.createTestNarrator(1),
      });

      const sahaba = await prisma.sahaba.create({
        data: testDataHelpers.createTestSahaba(1),
      });

      const transmitter = await prisma.transmitter.create({
        data: testDataHelpers.createTestTransmitter(1),
      });

      // Test data
      const hadithData = {
        numero: 900001,
        matn_fr: "Test French text",
        matn_ar: "Test Arabic text",
        chapter: chapter.name,
        narrator: narrator.name,
        mentionedSahabas: [sahaba.name],
        isnadTransmitters: [transmitter.name],
      };

      // Add hadith
      const result = await addHadith(hadithData);

      // Assertions
      expect(result.success).toBe(true);
      expect(result.message).toContain("ajouté avec succès");

      // Verify in database
      const createdHadith = await prisma.hadith.findUnique({
        where: { numero: 900001 },
        include: {
          chapter: true,
          narrator: true,
          mentionedSahabas: true,
          hadithTransmitters: {
            include: { transmitter: true },
            orderBy: { order: "asc" },
          },
        },
      });

      expect(createdHadith).not.toBeNull();
      expect(createdHadith?.matn_fr).toBe("Test French text");
      expect(createdHadith?.chapter.name).toBe(chapter.name);
      expect(createdHadith?.mentionedSahabas).toHaveLength(1);
      expect(createdHadith?.hadithTransmitters).toHaveLength(1);
    });

    it("should reject duplicate numero", async () => {
      // Create test dependencies
      const chapter = await prisma.chapter.create({
        data: testDataHelpers.createTestChapter(1),
      });

      const narrator = await prisma.narrator.create({
        data: testDataHelpers.createTestNarrator(1),
      });

      // Create first hadith
      await prisma.hadith.create({
        data: {
          ...testDataHelpers.createTestHadith(1),
          chapterId: chapter.id,
          narratorId: narrator.id,
        },
      });

      // Try to create duplicate
      const duplicateData = {
        numero: 900001, // Same as first hadith
        matn_fr: "Different text",
        matn_ar: "Different Arabic text",
        chapter: chapter.name,
        narrator: narrator.name,
        mentionedSahabas: [],
        isnadTransmitters: [],
      };

      const result = await addHadith(duplicateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("existe déjà");
    });

    it("should reject invalid data", async () => {
      const invalidData = {
        numero: -1, // Invalid numero
        matn_fr: "", // Empty required field
        matn_ar: "Valid Arabic",
        chapter: "Test Chapter",
        narrator: "Test Narrator",
        mentionedSahabas: [],
        isnadTransmitters: [],
      };

      const result = await addHadith(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Données invalides");
    });

    it("should reject non-existent chapter", async () => {
      const narrator = await prisma.narrator.create({
        data: testDataHelpers.createTestNarrator(1),
      });

      const data = {
        numero: 900001,
        matn_fr: "Test text",
        matn_ar: "Test Arabic",
        chapter: "Non-existent Chapter",
        narrator: narrator.name,
        mentionedSahabas: [],
        isnadTransmitters: [],
      };

      const result = await addHadith(data);

      expect(result.success).toBe(false);
      expect(result.message).toContain("non trouvé");
    });
  });

  describe("editHadith", () => {
    it("should update hadith with valid data", async () => {
      // Create test dependencies
      const chapter = await prisma.chapter.create({
        data: testDataHelpers.createTestChapter(1),
      });

      const narrator = await prisma.narrator.create({
        data: testDataHelpers.createTestNarrator(1),
      });

      // Create original hadith
      const originalHadith = await prisma.hadith.create({
        data: {
          ...testDataHelpers.createTestHadith(1),
          chapterId: chapter.id,
          narratorId: narrator.id,
        },
      });

      // Update data
      const updateData = {
        numero: 900001,
        matn_fr: "Updated French text",
        matn_ar: "Updated Arabic text",
        chapter: chapter.name,
        narrator: narrator.name,
        mentionedSahabas: [],
        isnadTransmitters: [],
      };

      const result = await editHadith(originalHadith.id, updateData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("modifié avec succès");

      // Verify update in database
      const updatedHadith = await prisma.hadith.findUnique({
        where: { id: originalHadith.id },
      });

      expect(updatedHadith?.matn_fr).toBe("Updated French text");
      expect(updatedHadith?.matn_ar).toBe("Updated Arabic text");
    });

    it("should reject non-existent hadith", async () => {
      const updateData = {
        numero: 900001,
        matn_fr: "Test text",
        matn_ar: "Test Arabic",
        chapter: "Test Chapter",
        narrator: "Test Narrator",
        mentionedSahabas: [],
        isnadTransmitters: [],
      };

      const result = await editHadith("non-existent-id", updateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Hadith non trouvé");
    });
  });

  describe("deleteHadith", () => {
    it("should delete existing hadith", async () => {
      // Create test dependencies
      const chapter = await prisma.chapter.create({
        data: testDataHelpers.createTestChapter(1),
      });

      const narrator = await prisma.narrator.create({
        data: testDataHelpers.createTestNarrator(1),
      });

      // Create hadith to delete
      const hadith = await prisma.hadith.create({
        data: {
          ...testDataHelpers.createTestHadith(1),
          chapterId: chapter.id,
          narratorId: narrator.id,
        },
      });

      const result = await deleteHadith(hadith.id);

      expect(result.success).toBe(true);
      expect(result.message).toContain("supprimé avec succès");

      // Verify deletion
      const deletedHadith = await prisma.hadith.findUnique({
        where: { id: hadith.id },
      });

      expect(deletedHadith).toBeNull();
    });

    it("should reject non-existent hadith", async () => {
      const result = await deleteHadith("non-existent-id");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Hadith non trouvé");
    });

    it("should reject empty hadithId", async () => {
      const result = await deleteHadith("");

      expect(result.success).toBe(false);
      expect(result.message).toBe("ID de hadith manquant");
    });
  });
});
