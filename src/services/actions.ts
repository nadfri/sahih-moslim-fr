"use server";

import { revalidatePath } from "next/cache";
import type { Chapter, Narrator, Sahaba } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";
import { getItemFormSchema } from "@/src/ui/forms/getItemFormSchema";
import { slugify } from "@/src/utils/slugify";
import { ItemFormValues, ItemType, VariantType } from "../types/types";

export type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
  data?: ItemType;
};

const checkIsAdmin = async () => {
  const session = await auth();
  return session && session.user.role === "ADMIN";
};

/* Add Item */
export async function addItem(
  variant: VariantType,
  data: ItemFormValues
): Promise<ActionResponse> {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  let items: ItemType[] = [];

  switch (variant) {
    case "chapters":
      items = await prisma.chapter.findMany();
      break;
    case "narrators":
      items = await prisma.narrator.findMany();
      break;
    case "sahabas":
      items = await prisma.sahaba.findMany();
      break;
    default:
      throw new Error("Type de variant non supporté");
  }

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
    let created: Chapter | Narrator | Sahaba;

    switch (variant) {
      case "chapters":
        created = await prisma.chapter.create({
          data: {
            name: validatedData.name,
            index: Number(validatedData.index),
            nameArabic: validatedData.nameArabic,
            slug: slug,
          },
        });
        break;
      case "narrators":
        created = await prisma.narrator.create({
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug: slug,
          },
        });
        break;
      case "sahabas":
        created = await prisma.sahaba.create({
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug: slug,
          },
        });
        break;
      default:
        throw new Error("Type de variant non supporté");
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
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  let items: ItemType[] = [];

  switch (variant) {
    case "chapters":
      items = await prisma.chapter.findMany();
      break;
    case "narrators":
      items = await prisma.narrator.findMany();
      break;
    case "sahabas":
      items = await prisma.sahaba.findMany();
      break;
    default:
      throw new Error("Type de variant non supporté");
  }

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

  try {
    let updated: Chapter | Narrator | Sahaba;

    switch (variant) {
      case "chapters":
        updated = await prisma.chapter.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            index: Number(validatedData.index),
            nameArabic: validatedData.nameArabic,
            slug: slug,
          },
        });
        break;
      case "narrators":
        updated = await prisma.narrator.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug: slug,
          },
        });
        break;
      case "sahabas":
        updated = await prisma.sahaba.update({
          where: { id: validatedData.id },
          data: {
            name: validatedData.name,
            nameArabic: validatedData.nameArabic,
            slug: slug,
          },
        });
        break;
      default:
        throw new Error("Type de variant non supporté");
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
      error: errorDetails,
    };
  }
}

/* Delete Item */
export async function deleteItem(
  variant: VariantType,
  id: string
): Promise<ActionResponse> {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  // Basic validation for ID
  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "ID invalide pour la suppression.",
      error: "ID manquant ou incorrect.",
    };
  }

  try {
    let deleted: Chapter | Narrator | Sahaba;

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
      default:
        throw new Error("Type de variant non supporté");
    }

    revalidatePath("/admin");

    return {
      success: true,
      message: "Élément supprimé avec succès.",
      data: deleted,
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
