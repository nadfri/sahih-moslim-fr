import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";

const prisma = new PrismaClient();

const TransmitterSchema = z.object({
  name_fr: z.string(),
  name_ar: z.string().nullable().optional(),
  name_en: z.string().nullable().optional(),
});

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
    const transmitters = z.array(TransmitterSchema).parse(body);

    function slugify(str: string): string {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    type Transmitter = z.infer<typeof TransmitterSchema>;
    const results = [];
    const failed: { item: Partial<Transmitter>; reason: string }[] = [];
    for (const transmitter of transmitters) {
      try {
        const slug = slugify(transmitter.name_fr);
        const result = await prisma.transmitter.upsert({
          where: { slug },
          update: {
            name_fr: transmitter.name_fr,
            name_ar: transmitter.name_ar,
            name_en: transmitter.name_en,
          },
          create: {
            name_fr: transmitter.name_fr,
            name_ar: transmitter.name_ar,
            name_en: transmitter.name_en,
            slug,
          },
        });
        results.push(result);
      } catch (e) {
        failed.push({
          item: transmitter,
          reason: (e as Error).message || "upsert failed",
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/transmitters");

    return NextResponse.json({
      message: `Imported ${results.length} transmitters`,
      imported: results.length,
      failed,
    });
  } catch (error) {
    console.error("Error importing transmitters:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to import transmitters" },
      { status: 500 }
    );
  }
}
