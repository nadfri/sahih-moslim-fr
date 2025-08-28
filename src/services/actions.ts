"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "@/prisma/prisma";
import { requireAdmin } from "@/src/lib/auth/auth";
import { getItemFormSchema } from "@/src/ui/forms/schemas/getItemFormSchema";
import { slugify } from "@/src/utils/slugify";
import { ItemFormValues, ItemType, VariantType } from "../types/types";
import { hadithSchema } from "../schemas/hadithSchemas";

export type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
  data?: unknown;
  affectedHadiths?: number;
};

async function getItems(variant: VariantType): Promise<ItemType[]> {
  switch (variant) {
    case "chapters":
      return prisma.chapter.findMany();
    case "narrators":
      return prisma.narrator.findMany({
        select: {
          id: true,
          name: true,
          nameArabic: true,
          slug: true,
        },
      });
    case "sahabas":
      return prisma.sahaba.findMany({
        select: {
          id: true,
          name: true,
          nameArabic: true,
          slug: true,
        },
      });
    case "transmitters":
      return prisma.transmitter.findMany({
        select: {
          id: true,
          name: true,
          nameArabic: true,
          slug: true,
        },
      });
  }
}

// =============================================================================
// ACTIONS POUR LES ITEMS (chapters, narrators, sahabas, transmitters)
// =============================================================================

/* Add Item */
export async function addItem(
  variant: VariantType,
  data: ItemFormValues
): Promise<ActionResponse> {
  // admin check refactored
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  const items = await getItems(variant);
  const schema = getItemFormSchema(items, variant);
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues
      .map((e) => e.message)
      .join(". ");
    return {
      success: false,
      message: `Erreur de validation: ${errorMessages}`,
    };
  }

  const validatedData = parseResult.data;
  const slug = slugify(validatedData.name);

  try {
    let created;

    switch (variant) {
      case "chapters":
        created = await prisma.chapter.create({
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
            index: Number(validatedData.index),
          },
        });
        break;
      case "narrators":
        created = await prisma.narrator.create({
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
          },
        });
        break;
      case "sahabas":
        created = await prisma.sahaba.create({
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
          },
        });
        break;
      case "transmitters":
        created = await prisma.transmitter.create({
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
          },
        });
        break;
    }

    revalidatePath("/admin");

    return {
      success: true,
      message: "Élément ajouté avec succès.",
      data: created,
    };
  } catch (error: unknown) {
    let userMessage = "Erreur inconnue lors de l'ajout.";
    const errorDetails = error instanceof Error ? error.message : String(error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | undefined;

        switch (true) {
          case !!target?.includes("name"):
            userMessage = "Ce nom est déjà utilisé.";
            break;
          case !!target?.includes("slug"):
            userMessage = "Ce slug est déjà utilisé.";
            break;
          case !!target?.includes("index"):
            userMessage = "Cet index est déjà utilisé.";
            break;
          default:
            userMessage = "Une valeur unique est déjà utilisée.";
        }
      }
    }
    return {
      success: false,
      message: userMessage,
      error: errorDetails,
    };
  }
}

/* Edit Item */
export async function editItem(
  variant: VariantType,
  data: ItemFormValues & { id: string }
): Promise<ActionResponse> {
  // admin check refactored
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  const items = await getItems(variant);
  const schema = getItemFormSchema(items, variant, data.id);
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues
      .map((e) => e.message)
      .join(". ");

    return {
      success: false,
      message: `Erreur de validation: ${errorMessages}`,
      error: errorMessages,
    };
  }

  const validatedData = parseResult.data as ItemFormValues & { id: string };

  const slug = slugify(validatedData.name);

  // Prevent modification of the 'Unknown' item (slug 'inconnu' or index 999)
  if (
    (variant === "chapters" &&
      (slug === "inconnu" || Number(validatedData.index) === 999)) ||
    (variant !== "chapters" && slug === "inconnu")
  ) {
    const msg =
      "Modification de l'élément 'Inconnu' interdite (élément système).";
    console.error(
      "[editItem] Tentative de modification de l'élément 'Inconnu'",
      validatedData
    );
    return {
      success: false,
      message: msg,
      error: msg,
    };
  }

  try {
    let updated;

    switch (variant) {
      case "chapters":
        updated = await prisma.chapter.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
            index: Number(validatedData.index),
          },
        });
        break;
      case "narrators":
        updated = await prisma.narrator.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
          },
        });
        break;
      case "sahabas":
        updated = await prisma.sahaba.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
          },
        });
        break;
      case "transmitters":
        updated = await prisma.transmitter.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug,
          },
        });
        break;
    }

    revalidatePath("/admin");

    return {
      success: true,
      message: "Élément modifié avec succès.",
      data: updated,
    };
  } catch (error: unknown) {
    let userMessage = "Erreur inconnue lors de la modification.";
    const errorDetails = error instanceof Error ? error.message : String(error);
    // Log serveur pour tout échec
    console.error("[editItem] Erreur lors de la modification:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | undefined;
        switch (true) {
          case !!target?.includes("name"):
            userMessage = "Ce nom est déjà utilisé.";
            break;
          case !!target?.includes("slug"):
            userMessage = "Ce slug est déjà utilisé.";
            break;
          case !!target?.includes("index"):
            userMessage = "Cet index est déjà utilisé.";
            break;
          default:
            userMessage = "Une valeur unique est déjà utilisée.";
        }
      } else if (error.code === "P2025") {
        userMessage = "L'élément à modifier n'a pas été trouvé.";
      }
    }
    return {
      success: false,
      message: userMessage,
      error: errorDetails || userMessage,
    };
  }
}

/* Delete Item */
export async function deleteItem(
  variant: VariantType,
  id: string
): Promise<ActionResponse & { affectedHadiths?: number }> {
  // admin check refactored
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "ID invalide pour la suppression.",
      error: "ID manquant ou incorrect.",
    };
  }

  try {
    let deleted;
    let affectedHadiths = 0;
    if (variant === "chapters" || variant === "narrators") {
      // 1. Vérifier les hadiths liés
      const hadiths = await prisma.hadith.findMany({
        where: variant === "chapters" ? { chapterId: id } : { narratorId: id },
        select: { id: true },
      });
      affectedHadiths = hadiths.length;
      if (affectedHadiths > 0) {
        // 2. Chercher ou créer l'élément 'Inconnu'
        let unknown;
        if (variant === "chapters") {
          unknown = await prisma.chapter.upsert({
            where: { slug: "inconnu" },
            update: {},
            create: {
              name: "Inconnu",
              slug: "inconnu",
              index: 999,
            },
          });
          // 3. Mettre à jour les hadiths
          await prisma.hadith.updateMany({
            where: { chapterId: id },
            data: { chapterId: unknown.id },
          });
        } else if (variant === "narrators") {
          unknown = await prisma.narrator.upsert({
            where: { slug: "inconnu" },
            update: {},
            create: {
              name: "Inconnu",
              slug: "inconnu",
            },
          });
          await prisma.hadith.updateMany({
            where: { narratorId: id },
            data: { narratorId: unknown.id },
          });
        }
      }
    }
    switch (variant) {
      case "chapters":
        deleted = await prisma.chapter.delete({ where: { id } });
        break;
      case "narrators":
        deleted = await prisma.narrator.delete({ where: { id } });
        break;
      case "sahabas":
        deleted = await prisma.sahaba.delete({ where: { id } });
        break;
      case "transmitters":
        deleted = await prisma.transmitter.delete({ where: { id } });
        break;
    }

    revalidatePath("/admin");

    return {
      success: true,
      message:
        affectedHadiths > 0
          ? `Élément supprimé. ${affectedHadiths} hadith(s) ont été rattachés à 'Inconnu'.`
          : "Élément supprimé avec succès.",
      data: deleted,
      affectedHadiths,
    };
  } catch (error: unknown) {
    let userMessage = "Erreur inconnue lors de la suppression.";

    const errorDetails = error instanceof Error ? error.message : String(error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        userMessage = "L'élément à supprimer n'a pas été trouvé.";
      }
    }
    return {
      success: false,
      message: userMessage,
      error: errorDetails,
    };
  }
}

// =============================================================================
// ACTIONS POUR LES HADITHS
// =============================================================================

/* ADD HADITH */
export async function addHadith(
  data: z.infer<typeof hadithSchema>
): Promise<ActionResponse> {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  // Validate data
  const parseResult = hadithSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Données invalides",
      error: parseResult.error.issues.map((e) => e.message).join(", "),
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
      where: { name: validData.chapter },
    });

    const narrator = await prisma.narrator.findUnique({
      where: { name: validData.narrator },
    });

    if (!chapter) {
      return {
        success: false,
        message: `Chapitre "${validData.chapter}" non trouvé`,
      };
    }

    if (!narrator) {
      return {
        success: false,
        message: `Narrateur "${validData.narrator}" non trouvé`,
      };
    }

    // Find sahabas
    const sahabas = await prisma.sahaba.findMany({
      where: { name: { in: validData.mentionedSahabas } },
    });

    if (sahabas.length !== validData.mentionedSahabas.length) {
      const foundNames = sahabas.map((s) => s.name);
      const notFound = validData.mentionedSahabas.filter(
        (name) => !foundNames.includes(name)
      );
      return {
        success: false,
        message: `Sahaba(s) non trouvé(s): ${notFound.join(", ")}`,
      };
    }

    // Find transmitters
    const transmitters = await prisma.transmitter.findMany({
      where: { name: { in: validData.isnadTransmitters } },
    });

    if (transmitters.length !== validData.isnadTransmitters.length) {
      const foundNames = transmitters.map((t) => t.name);
      const notFound = validData.isnadTransmitters.filter(
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
    if (validData.isnadTransmitters.length > 0) {
      const transmitterConnections = validData.isnadTransmitters.map(
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
  data: z.infer<typeof hadithSchema>
): Promise<ActionResponse> {
  // Check admin permission
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  // Validate data
  const parseResult = hadithSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Données invalides",
      error: parseResult.error.issues.map((e) => e.message).join(", "),
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
      where: { name: validData.chapter },
    });

    const narrator = await prisma.narrator.findUnique({
      where: { name: validData.narrator },
    });

    if (!chapter || !narrator) {
      return {
        success: false,
        message: "Chapitre ou narrateur non trouvé",
      };
    }

    // Find sahabas and transmitters (same validation as add)
    const sahabas = await prisma.sahaba.findMany({
      where: { name: { in: validData.mentionedSahabas } },
    });

    const transmitters = await prisma.transmitter.findMany({
      where: { name: { in: validData.isnadTransmitters } },
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
      },
    });

    // Handle sahabas update - disconnect all existing and connect new ones
    if (sahabas.length > 0) {
      await prisma.hadith.update({
        where: { id: hadithId },
        data: {
          mentionedSahabas: {
            set: sahabas.map((s) => ({ id: s.id })),
          },
        },
      });
    } else {
      // If no sahabas, disconnect all existing
      await prisma.hadith.update({
        where: { id: hadithId },
        data: {
          mentionedSahabas: {
            set: [],
          },
        },
      });
    }

    // Update transmitters - delete old and create new
    await prisma.hadithTransmitter.deleteMany({
      where: { hadithId },
    });

    if (validData.isnadTransmitters.length > 0) {
      const transmitterConnections = validData.isnadTransmitters.map(
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
export async function deleteHadith(hadithId: string): Promise<ActionResponse> {
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
