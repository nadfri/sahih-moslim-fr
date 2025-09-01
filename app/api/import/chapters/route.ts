import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const ChapterSchema = z.object({
  index: z.number(),
  name: z.string(),
  nameArabic: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file !== "object" || !("text" in file))
      throw new Error("No file uploaded or invalid file type");
    const text = await (file as Blob).text();
    const body = JSON.parse(text);
    const chapters = z.array(ChapterSchema).parse(body);

    // Simple slugify function
    function slugify(str: string): string {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const results = [];
    for (const chapter of chapters) {
      const slug = slugify(chapter.name);
      const result = await prisma.chapter.upsert({
        where: { name: chapter.name },
        update: {
          ...chapter,
          slug,
        },
        create: {
          ...chapter,
          slug,
        },
      });
      results.push(result);
    }

    return NextResponse.json({
      message: `Imported ${results.length} chapters`,
      imported: results.length,
    });
  } catch (error) {
    console.error("Error importing chapters:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to import chapters" },
      { status: 500 }
    );
  }
}
