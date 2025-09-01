import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const SahabaSchema = z.object({
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
    const sahabas = z.array(SahabaSchema).parse(body);

    function slugify(str: string): string {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const results = [];
    for (const sahaba of sahabas) {
      const slug = slugify(sahaba.name);
      const result = await prisma.sahaba.upsert({
        where: { name: sahaba.name },
        update: {
          ...sahaba,
          slug,
        },
        create: {
          ...sahaba,
          slug,
        },
      });
      results.push(result);
    }

    return NextResponse.json({
      message: `Imported ${results.length} sahabas`,
      imported: results.length,
    });
  } catch (error) {
    console.error("Error importing sahabas:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to import sahabas" },
      { status: 500 }
    );
  }
}
