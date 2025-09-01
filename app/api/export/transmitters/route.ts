import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transmitters = await prisma.transmitter.findMany({
      select: {
        name: true,
        nameArabic: true,
      },
      orderBy: { name: "asc" },
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
