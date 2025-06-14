import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";

const editHadithPayloadSchema = z.object({
  numero: z.number().int().positive(),
  matn_fr: z.string().min(1),
  matn_ar: z.string().min(1),
  chapterName: z.string().min(1),
  narratorName: z.string().min(1),
  mentionedSahabasNames: z.array(z.string()),
  isnadTransmittersNames: z.array(z.string()).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Admin authentication check for API access
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    // Always return error in english for API
    return Response.json(
      {
        success: false,
        message: "Unauthorized: admin access required.",
      },
      { status: 403 }
    );
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const validation = editHadithPayloadSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Données invalides",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const {
      numero,
      matn_fr,
      matn_ar,
      chapterName,
      narratorName,
      mentionedSahabasNames,
      isnadTransmittersNames = [],
    } = validation.data;
    // Find hadith by id
    const hadith = await prisma.hadith.findUnique({
      where: { id },
      select: { id: true, numero: true },
    });
    if (!hadith) {
      return Response.json(
        { success: false, message: "Hadith non trouvé." },
        { status: 404 }
      );
    }
    // Check if numero is unique (except for this hadith)
    const existingNumero = await prisma.hadith.findFirst({
      where: {
        numero,
        NOT: { id },
      },
      select: { id: true },
    });
    if (existingNumero) {
      return Response.json(
        {
          success: false,
          message: `Le numéro de hadith ${numero} existe déjà.`,
        },
        { status: 409 }
      );
    }
    // Find related records
    const chapter = await prisma.chapter.findUnique({
      where: { name: chapterName },
      select: { id: true },
    });
    const narrator = await prisma.narrator.findUnique({
      where: { name: narratorName },
      select: { id: true },
    });
    if (!chapter) {
      return Response.json(
        { success: false, message: `Chapitre \"${chapterName}\" non trouvé.` },
        { status: 400 }
      );
    }
    if (!narrator) {
      return Response.json(
        {
          success: false,
          message: `Narrateur \"${narratorName}\" non trouvé.`,
        },
        { status: 400 }
      );
    }
    // Find Sahabas by name
    const mentionedSahabas = await prisma.sahaba.findMany({
      where: { name: { in: mentionedSahabasNames } },
      select: { id: true, name: true },
    });
    if (mentionedSahabas.length !== mentionedSahabasNames.length) {
      const foundNames = mentionedSahabas.map((s) => s.name);
      const notFoundNames = mentionedSahabasNames.filter(
        (name) => !foundNames.includes(name)
      );
      return Response.json(
        {
          success: false,
          message: `Sahaba(s) non trouvé(s): ${notFoundNames.join(", ")}`,
        },
        { status: 400 }
      );
    }
    // Find Transmitters by name
    const isnadTransmitters = await prisma.transmitter.findMany({
      where: { name: { in: isnadTransmittersNames } },
      select: { id: true, name: true },
    });

    if (isnadTransmitters.length !== isnadTransmittersNames.length) {
      const foundNames = isnadTransmitters.map((t) => t.name);
      const notFoundNames = isnadTransmittersNames.filter(
        (name) => !foundNames.includes(name)
      );
      return Response.json(
        {
          success: false,
          message: `Transmetteur(s) non trouvé(s): ${notFoundNames.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Update hadith
    const updatedHadith = await prisma.hadith.update({
      where: { id },
      data: {
        numero,
        matn_fr,
        matn_ar,
        chapter: { connect: { id: chapter.id } },
        narrator: { connect: { id: narrator.id } },
        mentionedSahabas: {
          set: [],
          connect: mentionedSahabas.map((s) => ({ id: s.id })),
        },
      },
      include: {
        chapter: true,
        narrator: true,
        mentionedSahabas: true,
        hadithTransmitters: {
          include: {
            transmitter: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Delete existing transmitter relations and create new ordered ones
    await prisma.hadithTransmitter.deleteMany({
      where: { hadithId: id },
    });

    if (isnadTransmittersNames.length > 0) {
      // Create transmitter relations with order based on the array position
      const transmitterOrder = isnadTransmittersNames.map((name, index) => {
        const transmitter = isnadTransmitters.find((t) => t.name === name);
        return {
          hadithId: id,
          transmitterId: transmitter!.id,
          order: index + 1, // Start order from 1
        };
      });

      await prisma.hadithTransmitter.createMany({
        data: transmitterOrder,
      });
    }

    return Response.json({
      success: true,
      message: `Hadith #${updatedHadith.numero} modifié avec succès`,
      data: updatedHadith,
    });
  } catch (error) {
    console.error("Erreur lors de la modification du hadith:", error);
    let errorMessage =
      "Une erreur est survenue lors de la modification du hadith";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return Response.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
