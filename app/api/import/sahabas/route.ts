import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/prisma";
import { z } from "zod";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";

const SahabaSchema = z.object({
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
    const sahabas = z.array(SahabaSchema).parse(body);

    function slugify(str: string): string {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    type Sahaba = z.infer<typeof SahabaSchema>;
    const results = [];
    const failed: { item: Partial<Sahaba>; reason: string }[] = [];
    for (const sahaba of sahabas) {
      try {
        const slug = slugify(sahaba.name_fr);
        const result = await prisma.sahaba.upsert({
          where: { slug },
          update: {
            name_fr: sahaba.name_fr,
            name_ar: sahaba.name_ar,
            name_en: sahaba.name_en,
          },
          create: {
            name_fr: sahaba.name_fr,
            name_ar: sahaba.name_ar,
            name_en: sahaba.name_en,
            slug,
          },
        });
        results.push(result);
      } catch (e) {
        failed.push({
          item: sahaba,
          reason: (e as Error).message || "upsert failed",
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/sahabas");

    return NextResponse.json({
      message: `Imported ${results.length} sahabas`,
      imported: results.length,
      failed,
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
