import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    type Chapter = z.infer<typeof ChapterSchema>;
    const results = [];
    const failed: { item: Partial<Chapter>; reason: string }[] = [];
    for (const chapter of chapters) {
      try {
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
      } catch (e) {
        failed.push({
          item: chapter,
          reason: (e as Error).message || "upsert failed",
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/chapters");

    return NextResponse.json({
      message: `Imported ${results.length} chapters`,
      imported: results.length,
      failed,
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
