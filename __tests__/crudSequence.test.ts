import { describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { testDataHelpers } from "@/__tests__/test-helpers";
import { addHadith, deleteHadith, editHadith } from "@/src/services/actions";

// Mock requireAdmin before importing services
vi.mock("@/src/lib/auth", () => ({
  requireAdmin: async () => true,
}));

describe("Hadith CRUD - Sequence (Add -> Edit -> Delete)", () => {
  it("performs add, edit and delete in sequence without leaving artifacts", async () => {
    // unique suffix to avoid collisions
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const numero = 900000 + (Date.now() % 100000);

    const created: {
      chapterId?: string;
      narratorId?: string;
      sahabaId?: string;
      transmitterId?: string;
      hadithId?: string;
      hadithNumero?: number;
    } = {};

    try {
      // create related entities
      const chapter = await prisma.chapter.create({
        data: {
          ...testDataHelpers.createTestChapter(10),
          name: `Test Chapter ${suffix}`,
          slug: `test-chapter-${suffix}`,
          index: 9950 + Math.floor(Math.random() * 50),
        },
      });
      created.chapterId = chapter.id;

      const narrator = await prisma.narrator.create({
        data: {
          ...testDataHelpers.createTestNarrator(10),
          name: `Test Narrator ${suffix}`,
          slug: `test-narrator-${suffix}`,
        },
      });
      created.narratorId = narrator.id;

      const sahaba = await prisma.sahaba.create({
        data: {
          ...testDataHelpers.createTestSahaba(10),
          name: `Test Sahaba ${suffix}`,
          slug: `test-sahaba-${suffix}`,
        },
      });
      created.sahabaId = sahaba.id;

      const transmitter = await prisma.transmitter.create({
        data: {
          ...testDataHelpers.createTestTransmitter(10),
          name: `Test Transmitter ${suffix}`,
          slug: `test-transmitter-${suffix}`,
        },
      });
      created.transmitterId = transmitter.id;

      // ADD
      const hadithData = {
        numero,
        matn_fr: `French text for test hadith ${suffix}`,
        matn_ar: `Arabic text for test hadith ${suffix}`,
        chapter: chapter.name,
        narrator: narrator.name,
        mentionedSahabas: [sahaba.name],
        isnadTransmitters: [transmitter.name],
      };

      const addResult = await addHadith(hadithData);
      expect(
        addResult.success,
        `addHadith failed: ${JSON.stringify(addResult)}`
      ).toBe(true);

      const saved = await prisma.hadith.findUnique({ where: { numero } });
      expect(saved).toBeTruthy();
      created.hadithId = saved!.id;
      created.hadithNumero = numero;

      // EDIT
      const editData = {
        ...hadithData,
        matn_fr: hadithData.matn_fr + " - edited",
      };

      const editResult = await editHadith(created.hadithId as string, editData);
      expect(
        editResult.success,
        `editHadith failed: ${JSON.stringify(editResult)}`
      ).toBe(true);

      const afterEdit = await prisma.hadith.findUnique({
        where: { id: created.hadithId },
      });
      expect(afterEdit?.matn_fr).toContain("edited");

      // DELETE
      const deleteResult = await deleteHadith(created.hadithId as string);
      expect(
        deleteResult.success,
        `deleteHadith failed: ${JSON.stringify(deleteResult)}`
      ).toBe(true);

      const afterDelete = await prisma.hadith.findUnique({
        where: { id: created.hadithId },
      });
      expect(afterDelete).toBeNull();
    } finally {
      // targeted cleanup to be safe
      if (created.hadithNumero)
        await prisma.hadith.deleteMany({
          where: { numero: created.hadithNumero },
        });
      if (created.chapterId)
        await prisma.chapter.deleteMany({ where: { id: created.chapterId } });
      if (created.narratorId)
        await prisma.narrator.deleteMany({ where: { id: created.narratorId } });
      if (created.sahabaId)
        await prisma.sahaba.deleteMany({ where: { id: created.sahabaId } });
      if (created.transmitterId)
        await prisma.transmitter.deleteMany({
          where: { id: created.transmitterId },
        });
    }
  });
});
