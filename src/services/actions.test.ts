import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock auth to always allow admin before importing actions
vi.mock("@/src/lib/auth/supabase/helpers", () => ({
  requireAdmin: async () => true,
}));

// Mock next/cache.revalidatePath in case actions call it (no-op)
vi.mock("next/cache", () => ({
  revalidatePath: () => {
    /* no-op */
  },
}));

import prisma from "@/prisma/prisma";
import { cleanupTestData, testDataHelpers } from "@/__tests__/test-helpers";
import { addHadith, deleteHadith, editHadith } from "@/src/services/actions";
import { ValidateHadithDataSchema } from "@/src/services/hadithSchemaServer";
import type { z } from "zod";
type HadithInput = z.infer<typeof ValidateHadithDataSchema>;

describe("Actions (hadith) - robust", () => {
  // Keep a targeted cleanup before each test to ensure isolation. We avoid
  // expensive global deletions and prefer removing only the created entities.
  beforeEach(async () => {
    await cleanupTestData();
  });

  it("creates, edits and deletes a hadith in isolation", async () => {
    // Create isolated entities with UUID-backed names
    const chapterData = testDataHelpers.createTestChapter(1);
    const chapter = await prisma.chapter.create({ data: chapterData });

    const sahabaData = testDataHelpers.createTestSahaba(1);
    const sahaba = await prisma.sahaba.create({ data: sahabaData });

    const transmitterData = testDataHelpers.createTestTransmitter(1);
    const transmitter = await prisma.transmitter.create({
      data: transmitterData,
    });

    const numero = 900000 + Math.floor(Math.random() * 100000);

    const hadithPayload: HadithInput = {
      numero,
      matn_fr: "Payload French",
      matn_ar: "Payload Arabic",
      chapter: chapter.name_fr,
      mentionedSahabas: [sahaba.name_fr],
      isnadTransmitters: [transmitter.name_fr],
    };

    const addResult = await addHadith(hadithPayload);
    expect(addResult.success).toBe(true);
    expect(addResult.message).toContain("ajouté");

    // Validate created hadith
    const created = await prisma.hadith.findUnique({ where: { numero } });
    expect(created).toBeTruthy();

    // Edit hadith
    const editPayload: HadithInput = {
      ...hadithPayload,
      matn_fr: "Edited French",
    };

    const editResult = await editHadith(created!.id, editPayload);
    expect(editResult.success).toBe(true);

    const afterEdit = await prisma.hadith.findUnique({
      where: { id: created!.id },
    });
    expect(afterEdit?.matn_fr).toBe("Edited French");

    // Delete hadith
    const deleteResult = await deleteHadith(created!.id);
    expect(deleteResult.success).toBe(true);
    const afterDelete = await prisma.hadith.findUnique({
      where: { id: created!.id },
    });
    expect(afterDelete).toBeNull();
  });

  it("validates error cases for addHadith", async () => {
    // missing chapter should fail

    const payload: HadithInput = {
      numero: 900002,
      matn_fr: "x",
      matn_ar: "x",
      chapter: "non-existent-chapter",
      mentionedSahabas: [],
      isnadTransmitters: [],
    };

    const result = await addHadith(payload);
    expect(result.success).toBe(false);
    expect(result.message).toContain("non trouvé");
  });
});
