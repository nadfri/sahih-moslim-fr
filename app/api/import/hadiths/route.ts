type ImportedEntity = {
  slug?: string;
  name_fr?: string;
  name_ar?: string;
  name_en?: string;
  index?: number;
};

function resolveNameField(s: ImportedEntity): string | undefined {
  if (s.name_fr) return s.name_fr;
  if (s.name_ar) return s.name_ar;
  if (s.name_en) return s.name_en;
  return undefined;
}
// Utility to resolve multilingual name field from sahaba object
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import type { Chapter, Sahaba, Transmitter, Hadith } from "@prisma/client";
import { z } from "zod";
import { ImportedHadithSchema } from "@/src/types/types";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";

const prisma = new PrismaClient();

const HadithSchema = ImportedHadithSchema;

export async function POST(request: NextRequest) {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) {
    return NextResponse.json(adminCheck, {
      status: adminCheck.success ? 200 : 401,
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file !== "object" || !("text" in file))
      throw new Error("No file uploaded or invalid file type");
    const text = await (file as Blob).text();
    const body = JSON.parse(text);
    const hadiths = z.array(HadithSchema).parse(body);

    const results = [];

    // Preload referenced entities to avoid repeated DB queries per hadith.
    // Build lookup maps: by index, slug and lowercased name for fast O(1) resolution.
    const [allChapters, allSahabas, allTransmitters] = await Promise.all([
      prisma.chapter.findMany(),
      prisma.sahaba.findMany(),
      prisma.transmitter.findMany(),
    ]);

    const chapterByIndex = new Map<number, Chapter>();
    const chapterBySlug = new Map<string, Chapter>();
    const chapterByNameLower = new Map<string, Chapter>();
    for (const c of allChapters) {
      if (typeof c.index === "number") chapterByIndex.set(c.index, c);
      if (c.slug) chapterBySlug.set(c.slug, c);
      if (c.name_fr) chapterByNameLower.set(c.name_fr.toLowerCase(), c);
      if (c.name_ar) chapterByNameLower.set(c.name_ar.toLowerCase(), c);
      if (c.name_en) chapterByNameLower.set(c.name_en.toLowerCase(), c);
    }

    const sahabaBySlug = new Map<string, Sahaba>();
    const sahabaByNameLower = new Map<string, Sahaba>();
    for (const s of allSahabas) {
      if (s.slug) sahabaBySlug.set(s.slug, s);
      if (s.name_fr) sahabaByNameLower.set(s.name_fr.toLowerCase(), s);
      if (s.name_ar) sahabaByNameLower.set(s.name_ar.toLowerCase(), s);
      if (s.name_en) sahabaByNameLower.set(s.name_en.toLowerCase(), s);
    }

    const transmitterByNameLower = new Map<string, Transmitter>();
    for (const t of allTransmitters) {
      if (t.name_fr) transmitterByNameLower.set(t.name_fr.toLowerCase(), t);
      if (t.name_ar) transmitterByNameLower.set(t.name_ar.toLowerCase(), t);
      if (t.name_en) transmitterByNameLower.set(t.name_en.toLowerCase(), t);
    }
    // Determine which hadith numeros already exist to avoid re-creating them
    const numeros = hadiths.map((h) => h.numero).filter((n) => n !== undefined);
    const existing = await prisma.hadith.findMany({
      where: { numero: { in: numeros } },
      select: { numero: true },
    });
    const existingSet = new Set(existing.map((e) => e.numero));

    const createOperations: Array<ReturnType<typeof prisma.hadith.create>> = [];
    const failedHadiths: { numero?: number; reason: string }[] = [];

    for (const hadith of hadiths) {
      // Resolve chapter using preloaded maps: prefer explicit chapter.index -> chapterIndex -> slug -> chapterName
      const chapterIndex = hadith.chapter?.index ?? hadith.chapterIndex;
      const chapterSlug = hadith.chapter?.slug ?? undefined;
      const chapterName =
        (hadith.chapter as ImportedEntity)?.name_fr ??
        (hadith.chapter as ImportedEntity)?.name_ar ??
        (hadith.chapter as ImportedEntity)?.name_en ??
        hadith.chapterName ??
        undefined;

      let chapter = null as { id: string } | null;
      if (chapterIndex !== undefined && chapterIndex !== null) {
        chapter = chapterByIndex.get(Number(chapterIndex)) ?? null;
      }
      if (!chapter && chapterSlug) {
        chapter = chapterBySlug.get(chapterSlug) ?? null;
      }
      if (!chapter && chapterName) {
        chapter = chapterByNameLower.get(chapterName.toLowerCase()) ?? null;
      }

      if (!chapter) {
        failedHadiths.push({
          numero: hadith.numero,
          reason: "Chapitre non trouvé",
        });
        continue;
      }

      // Resolve mentioned sahabas using preloaded maps. Accept strings (name/slug) or object {slug?, name?}
      const mentionedSahabas = [] as { id: string }[];
      if (hadith.mentionedSahabas) {
        for (const s of hadith.mentionedSahabas) {
          if (typeof s === "string") {
            const lower = s.toLowerCase();
            const byName = sahabaByNameLower.get(lower) ?? null;
            const bySlug = sahabaBySlug.get(s) ?? null;
            const sahaba = byName ?? bySlug;
            if (sahaba) mentionedSahabas.push({ id: sahaba.id });
          } else {
            const sahabaObj = s as ImportedEntity;
            const slugField: string | undefined = sahabaObj.slug;
            const nameField: string | undefined = resolveNameField(sahabaObj);
            let sahaba = null as { id: string } | null;
            if (slugField) sahaba = sahabaBySlug.get(slugField) ?? null;
            if (!sahaba && nameField)
              sahaba = sahabaByNameLower.get(nameField.toLowerCase()) ?? null;
            if (sahaba) mentionedSahabas.push({ id: sahaba.id });
          }
        }
      }

      // If some mentioned sahabas were expected but none resolved, mark as failed
      if (
        (hadith.mentionedSahabas?.length ?? 0) > 0 &&
        mentionedSahabas.length === 0
      ) {
        failedHadiths.push({
          numero: hadith.numero,
          reason: "Compagnon non trouvé",
        });
        continue;
      }

      // Resolve transmitters from isnad names using preloaded map (case-insensitive)
      const isnadTransmitters = [] as { id: string }[];
      if (hadith.isnad) {
        for (const name of hadith.isnad) {
          const t = transmitterByNameLower.get(name.toLowerCase());
          if (t) isnadTransmitters.push({ id: t.id });
        }
        // If wasnad provided but none resolved, mark as failed
        if (hadith.isnad.length > 0 && isnadTransmitters.length === 0) {
          failedHadiths.push({
            numero: hadith.numero,
            reason: "Transmitteurs non trouvés",
          });
          continue;
        }
      }
      // If hadith already exists, skip creating it (user requested to keep only non-present)
      if (existingSet.has(hadith.numero)) {
        continue;
      }

      // Prepare create operation and push into operations list
      createOperations.push(
        prisma.hadith.create({
          data: {
            numero: hadith.numero,
            matn_fr: hadith.matn_fr,
            matn_ar: hadith.matn_ar,
            matn_en: hadith.matn_en || "",
            chapterId: chapter.id,
            mentionedSahabas: {
              connect: mentionedSahabas.map((s) => ({ id: s.id })),
            },
            hadithTransmitters: {
              create: isnadTransmitters.map((t, index) => ({
                transmitterId: t.id,
                order: index,
              })),
            },
          },
        })
      );
    }

    // Execute create operations in chunks to avoid very large single transactions
    const createdResults: Hadith[] = [];
    if (createOperations.length > 0) {
      const chunkSize = 100; // safe default for batch imports, tuneable
      for (let i = 0; i < createOperations.length; i += chunkSize) {
        const batch = createOperations.slice(i, i + chunkSize);
        const created = await prisma.$transaction(batch);
        createdResults.push(...(created as Hadith[]));
      }
      results.push(...createdResults);
    }

    revalidatePath("/");
    revalidatePath("/hadith");

    return NextResponse.json({
      message: `Imported ${results.length} hadiths`,
      imported: results.length,
      failed: failedHadiths,
    });
  } catch (error) {
    console.error("Error importing hadiths:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to import hadiths" },
      { status: 500 }
    );
  }
}
