"use server";

import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";
import { getItemFormSchema } from "@/src/ui/forms/schemas/getItemFormSchema";
import { slugify } from "@/src/utils/slugify";
import { ItemFormValues, ItemType, VariantType } from "../types/types";

export type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
  data?: ItemType;
};

// Helper to check admin and return ActionResponse if not
async function requireAdmin(): Promise<true | ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }
  return true;
}

async function getItems(variant: VariantType): Promise<ItemType[]> {
  switch (variant) {
    case "chapters":
      return prisma.chapter.findMany();
    case "narrators":
      return prisma.narrator.findMany();
    case "sahabas":
      return prisma.sahaba.findMany();
    case "transmitters":
      return prisma.transmitter.findMany();
  }
}

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
    const errorMessages = parseResult.error.errors
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
    const errorMessages = parseResult.error.errors
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
