import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";

// DELETE /api/hadiths/delete/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Admin authentication check for API access
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    // Always return error in english for API
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: admin access required.",
      },
      { status: 403 }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing hadith ID" }, { status: 400 });
  }
  try {
    await prisma.hadith.delete({
      where: { id },
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
