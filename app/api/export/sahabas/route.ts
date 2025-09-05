import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sahabas = await prisma.sahaba.findMany({
      select: {
        name_fr: true,
        name_ar: true,
        name_en: true,
      },
      orderBy: { name_fr: "asc" },
    });

    return new NextResponse(JSON.stringify(sahabas, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="sahabas.json"',
      },
    });
  } catch (error) {
    console.error("Error exporting sahabas:", error);
    return NextResponse.json(
      { error: "Failed to export sahabas" },
      { status: 500 }
    );
  }
}
