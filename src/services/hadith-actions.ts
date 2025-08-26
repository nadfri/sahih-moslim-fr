"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/prisma/prisma";
import { requireAdmin } from "@/src/lib/auth";

// Simple types for actions
export type HadithActionResult = {
  success: boolean;
  message: string;
  error?: string;
  data?: unknown;
};

// Validation schema - keep it simple
const hadithSchema = z.object({
  numero: z.number().int().positive(),
  matn_fr: z.string().min(1, "Le texte français est requis"),
  matn_ar: z.string().min(1, "Le texte arabe est requis"),
  chapterName: z.string().min(1, "Le chapitre est requis"),
  narratorName: z.string().min(1, "Le narrateur est requis"),
  mentionedSahabasNames: z.array(z.string()),
  isnadTransmittersNames: z.array(z.string()),
});

type HadithData = z.infer<typeof hadithSchema>;

/* ADD HADITH */
export async function addHadith(data: HadithData): Promise<HadithActionResult> {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  // Validate data
  const parseResult = hadithSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Données invalides",
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  const validData = parseResult.data;

  try {
    // Check if hadith number already exists
    const existingHadith = await prisma.hadith.findUnique({
      where: { numero: validData.numero },
    });

    if (existingHadith) {
      return {
        success: false,
        message: `Le numéro de hadith ${validData.numero} existe déjà`,
      };
    }

    // Find related entities
    const chapter = await prisma.chapter.findUnique({
      where: { name: validData.chapterName },
    });

    const narrator = await prisma.narrator.findUnique({
      where: { name: validData.narratorName },
    });

    if (!chapter) {
      return {
        success: false,
        message: `Chapitre "${validData.chapterName}" non trouvé`,
      };
    }

    if (!narrator) {
      return {
        success: false,
        message: `Narrateur "${validData.narratorName}" non trouvé`,
      };
    }

    // Find sahabas
    const sahabas = await prisma.sahaba.findMany({
      where: { name: { in: validData.mentionedSahabasNames } },
    });

    if (sahabas.length !== validData.mentionedSahabasNames.length) {
      const foundNames = sahabas.map((s) => s.name);
      const notFound = validData.mentionedSahabasNames.filter(
        (name) => !foundNames.includes(name)
      );
      return {
        success: false,
        message: `Sahaba(s) non trouvé(s): ${notFound.join(", ")}`,
      };
    }

    // Find transmitters
    const transmitters = await prisma.transmitter.findMany({
      where: { name: { in: validData.isnadTransmittersNames } },
    });

    if (transmitters.length !== validData.isnadTransmittersNames.length) {
      const foundNames = transmitters.map((t) => t.name);
      const notFound = validData.isnadTransmittersNames.filter(
        (name) => !foundNames.includes(name)
      );
      return {
        success: false,
        message: `Transmetteur(s) non trouvé(s): ${notFound.join(", ")}`,
      };
    }

    // Create hadith
    const newHadith = await prisma.hadith.create({
      data: {
        numero: validData.numero,
        matn_fr: validData.matn_fr,
        matn_ar: validData.matn_ar,
        chapterId: chapter.id,
        narratorId: narrator.id,
        mentionedSahabas: {
          connect: sahabas.map((s) => ({ id: s.id })),
        },
      },
    });

    // Add transmitters with order
    if (validData.isnadTransmittersNames.length > 0) {
      const transmitterConnections = validData.isnadTransmittersNames.map(
        (name, index) => {
          const transmitter = transmitters.find((t) => t.name === name)!;
          return {
            hadithId: newHadith.id,
            transmitterId: transmitter.id,
            order: index + 1,
          };
        }
      );

      await prisma.hadithTransmitter.createMany({
        data: transmitterConnections,
      });
    }

    // Revalidate only in production
    if (process.env.NODE_ENV !== "test") {
      revalidatePath("/");
    }
    return {
      success: true,
      message: `Hadith #${newHadith.numero} ajouté avec succès`,
      data: newHadith,
    };
  } catch (error) {
    console.error("Error adding hadith:", error);
    return {
      success: false,
      message: "Erreur lors de l'ajout du hadith",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/* EDIT HADITH */
export async function editHadith(
  hadithId: string,
  data: HadithData
): Promise<HadithActionResult> {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  // Validate data
  const parseResult = hadithSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Données invalides",
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  const validData = parseResult.data;

  try {
    // Check if hadith exists
    const existingHadith = await prisma.hadith.findUnique({
      where: { id: hadithId },
    });

    if (!existingHadith) {
      return {
        success: false,
        message: "Hadith non trouvé",
      };
    }

    // Check if numero is unique (excluding current hadith)
    const duplicateNumero = await prisma.hadith.findFirst({
      where: {
        numero: validData.numero,
        NOT: { id: hadithId },
      },
    });

    if (duplicateNumero) {
      return {
        success: false,
        message: `Le numéro ${validData.numero} est déjà utilisé`,
      };
    }

    // Find related entities (same logic as add)
    const chapter = await prisma.chapter.findUnique({
      where: { name: validData.chapterName },
    });

    const narrator = await prisma.narrator.findUnique({
      where: { name: validData.narratorName },
    });

    if (!chapter || !narrator) {
      return {
        success: false,
        message: "Chapitre ou narrateur non trouvé",
      };
    }

    // Find sahabas and transmitters (same validation as add)
    const sahabas = await prisma.sahaba.findMany({
      where: { name: { in: validData.mentionedSahabasNames } },
    });

    const transmitters = await prisma.transmitter.findMany({
      where: { name: { in: validData.isnadTransmittersNames } },
    });

    // Update hadith
    const updatedHadith = await prisma.hadith.update({
      where: { id: hadithId },
      data: {
        numero: validData.numero,
        matn_fr: validData.matn_fr,
        matn_ar: validData.matn_ar,
        chapterId: chapter.id,
        narratorId: narrator.id,
        mentionedSahabas: {
          set: sahabas.map((s) => ({ id: s.id })),
        },
      },
    });

    // Update transmitters - delete old and create new
    await prisma.hadithTransmitter.deleteMany({
      where: { hadithId },
    });

    if (validData.isnadTransmittersNames.length > 0) {
      const transmitterConnections = validData.isnadTransmittersNames.map(
        (name, index) => {
          const transmitter = transmitters.find((t) => t.name === name)!;
          return {
            hadithId,
            transmitterId: transmitter.id,
            order: index + 1,
          };
        }
      );

      await prisma.hadithTransmitter.createMany({
        data: transmitterConnections,
      });
    }

    // Revalidate only in production
    if (process.env.NODE_ENV !== "test") {
      revalidatePath("/");
      revalidatePath(`/hadiths/${validData.numero}`);
    }
    return {
      success: true,
      message: `Hadith #${validData.numero} modifié avec succès`,
      data: updatedHadith,
    };
  } catch (error) {
    console.error("Error editing hadith:", error);
    return {
      success: false,
      message: "Erreur lors de la modification",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/* DELETE HADITH */
export async function deleteHadith(
  hadithId: string
): Promise<HadithActionResult> {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  if (!hadithId) {
    return {
      success: false,
      message: "ID de hadith manquant",
    };
  }

  try {
    // Check if hadith exists
    const hadith = await prisma.hadith.findUnique({
      where: { id: hadithId },
      select: { numero: true },
    });

    if (!hadith) {
      return {
        success: false,
        message: "Hadith non trouvé",
      };
    }

    // Delete hadith (relations will be deleted automatically)
    await prisma.hadith.delete({
      where: { id: hadithId },
    });

    // Revalidate only in production
    if (process.env.NODE_ENV !== "test") {
      revalidatePath("/");
    }
    return {
      success: true,
      message: `Hadith #${hadith.numero} supprimé avec succès`,
    };
  } catch (error) {
    console.error("Error deleting hadith:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/* DELETE WITH REDIRECT */
export async function deleteHadithAndRedirect(hadithId: string) {
  const result = await deleteHadith(hadithId);
  if (result.success) {
    redirect("/");
  }
  return result;
}
