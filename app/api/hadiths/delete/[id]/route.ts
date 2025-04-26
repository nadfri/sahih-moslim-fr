import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma/prisma";

// DELETE /api/hadiths/delete/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const hadithId = params.id;
  if (!hadithId) {
    return NextResponse.json({ message: "Missing hadith ID" }, { status: 400 });
  }
  try {
    await prisma.hadith.delete({
      where: { id: hadithId },
    });
    return NextResponse.json(
      { message: "Hadith deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Error deleting hadith" },
      { status: 500 }
    );
  }
}
