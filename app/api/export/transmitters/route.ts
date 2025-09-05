import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/auth";

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
    const transmitters = await prisma.transmitter.findMany({
      select: {
        name_fr: true,
        name_ar: true,
        name_en: true,
      },
      orderBy: { name_fr: "asc" },
    });

    return new NextResponse(JSON.stringify(transmitters, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="transmitters.json"',
      },
    });
  } catch (error) {
    console.error("Error exporting transmitters:", error);
    return NextResponse.json(
      { error: "Failed to export transmitters" },
      { status: 500 }
    );
  }
}
