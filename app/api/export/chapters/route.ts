import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";

const prisma = new PrismaClient();

export async function GET() {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) {
    return NextResponse.json(adminCheck, {
      status: adminCheck.success ? 200 : 401,
    });
  }

  try {
    const chapters = await prisma.chapter.findMany({
      select: {
        index: true,
        name_fr: true,
        name_ar: true,
        name_en: true,
      },
      orderBy: { index: "asc" },
    });

    return new NextResponse(JSON.stringify(chapters, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="chapters.json"',
      },
    });
  } catch (error) {
    console.error("Error exporting chapters:", error);
    return NextResponse.json(
      { error: "Failed to export chapters" },
      { status: 500 }
    );
  }
}
