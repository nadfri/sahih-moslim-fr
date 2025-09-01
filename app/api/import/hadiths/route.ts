import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const HadithSchema = z.object({
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  matn_en: z.string().optional(),
  chapter: z.object({
    slug: z.string(),
  }),
  mentionedSahabas: z
    .array(
      z.object({
        slug: z.string(),
      })
    )
    .optional(),
  isnadTransmitters: z
    .array(
      z.object({
        slug: z.string(),
      })
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file !== "object" || !("text" in file))
      throw new Error("No file uploaded or invalid file type");
    const text = await (file as Blob).text();
    const body = JSON.parse(text);
    const hadiths = z.array(HadithSchema).parse(body);

    const results = [];
    for (const hadith of hadiths) {
      // Find chapter
      const chapter = await prisma.chapter.findUnique({
        where: { slug: hadith.chapter.slug },
      });
      if (!chapter) {
        throw new Error(`Chapter with slug ${hadith.chapter.slug} not found`);
      }

      // Find sahabas
      const mentionedSahabas = [];
      if (hadith.mentionedSahabas) {
        for (const s of hadith.mentionedSahabas) {
          const sahaba = await prisma.sahaba.findUnique({
            where: { slug: s.slug },
          });
          if (sahaba) mentionedSahabas.push(sahaba);
        }
      }

      // Find transmitters
      const isnadTransmitters = [];
      if (hadith.isnadTransmitters) {
        for (const t of hadith.isnadTransmitters) {
          const transmitter = await prisma.transmitter.findUnique({
            where: { slug: t.slug },
          });
          if (transmitter) isnadTransmitters.push(transmitter);
        }
      }

      const result = await prisma.hadith.upsert({
        where: { numero: hadith.numero },
        update: {
          matn_fr: hadith.matn_fr,
          matn_ar: hadith.matn_ar,
          ...(hadith.matn_en && { matn_en: hadith.matn_en }),
          chapterId: chapter.id,
          mentionedSahabas: {
            set: mentionedSahabas.map((s) => ({ id: s.id })),
          },
          hadithTransmitters: {
            deleteMany: {},
            create: isnadTransmitters.map((t, index) => ({
              transmitterId: t.id,
              order: index,
            })),
          },
        },
        create: {
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
      });
      results.push(result);
    }

    return NextResponse.json({
      message: `Imported ${results.length} hadiths`,
      imported: results.length,
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
