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
