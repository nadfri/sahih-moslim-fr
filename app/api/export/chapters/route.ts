import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
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
