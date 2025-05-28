import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";

const addHadithPayloadSchema = z.object({
  numero: z.number().int().positive(),
  matn_fr: z.string().min(1),
  matn_ar: z.string().min(1),
  chapterName: z.string().min(1),
  narratorName: z.string().min(1),
  mentionedSahabasNames: z.array(z.string()),
  isnadTransmittersNames: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const validation = addHadithPayloadSchema.safeParse(body);

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

    // 2. Check if hadith number already exists
    const existingHadith = await prisma.hadith.findUnique({
      where: { numero },
      select: { id: true }, // Only select id for efficiency
    });

    if (existingHadith) {
      return Response.json(
        {
          success: false,
          message: `Le numéro de hadith ${numero} existe déjà.`,
        },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Find related records (Chapter, Narrator, Sahabas) by name/title
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
        { success: false, message: `Chapitre "${chapterName}" non trouvé.` },
        { status: 400 }
      );
    }

    if (!narrator) {
      return Response.json(
        { success: false, message: `Narrateur "${narratorName}" non trouvé.` },
        { status: 400 }
      );
    }

    // Find Sahabas by name and get their IDs
    const mentionedSahabas = await prisma.sahaba.findMany({
      where: {
        name: {
          in: mentionedSahabasNames,
        },
      },
      select: { id: true, name: true }, // Select name too for error reporting
    });

    // Verify all mentioned sahabas were found
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

    // Find Transmitters by name and get their IDs
    const isnadTransmitters = await prisma.transmitter.findMany({
      where: {
        name: {
          in: isnadTransmittersNames,
        },
      },
      select: { id: true, name: true },
    });

    // Verify all mentioned transmitters were found
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

    // 4. Create the new Hadith record
    const newHadith = await prisma.hadith.create({
      data: {
        numero,
        matn_fr,
        matn_ar,
        chapter: {
          connect: { id: chapter.id },
        },
        narrator: {
          connect: { id: narrator.id },
        },
        mentionedSahabas: {
          connect: mentionedSahabas.map((sahaba) => ({ id: sahaba.id })),
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

    // 5. Create ordered transmitter relations
    if (isnadTransmittersNames.length > 0) {
      // Create transmitter relations with order based on the array position
      const transmitterOrder = isnadTransmittersNames.map((name, index) => {
        const transmitter = isnadTransmitters.find((t) => t.name === name);
        return {
          hadithId: newHadith.id,
          transmitterId: transmitter!.id,
          order: index + 1, // Start order from 1
        };
      });

      await prisma.hadithTransmitter.createMany({
        data: transmitterOrder,
      });
    }

    // 6. Return success response
    return Response.json({
      success: true,
      message: `Hadith #${newHadith.numero} ajouté avec succès`,
      data: newHadith, // Return the created hadith data
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du hadith:", error);
    // Handle potential Prisma errors or other unexpected errors
    let errorMessage = "Une erreur est survenue lors de l'ajout du hadith";
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
