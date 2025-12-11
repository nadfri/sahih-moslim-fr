import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";
import prisma from "@/prisma/prisma";

export async function GET() {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) {
    return NextResponse.json(adminCheck, {
      status: adminCheck.success ? 200 : 401,
    });
  }

  try {
    const hadiths = await prisma.hadith.findMany({
      select: {
        numero: true,
        matn_fr: true,
        matn_ar: true,
        matn_en: true,
        chapter: {
          select: {
            index: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
            slug: true,
          },
        },
        mentionedSahabas: {
          select: {
            name_fr: true,
          },
        },
        hadithTransmitters: {
          select: {
            order: true,
            transmitter: {
              select: {
                name_fr: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: { numero: "asc" },
    });

    // Transform to clean export format
    const transformedHadiths = hadiths.map((h) => ({
      numero: h.numero,
      matn_fr: h.matn_fr,
      matn_ar: h.matn_ar,
      matn_en: h.matn_en,
      chapterIndex: h.chapter.index,
      mentionedSahabas: h.mentionedSahabas.map((s) => s.name_fr),
      isnad: h.hadithTransmitters.map((ht) => ht.transmitter.name_fr),
    }));

    return new NextResponse(JSON.stringify(transformedHadiths, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="hadiths.json"',
      },
    });
  } catch (error) {
    console.error("Error exporting hadiths:", error);
    return NextResponse.json(
      { error: "Failed to export hadiths" },
      { status: 500 }
    );
  }
}
