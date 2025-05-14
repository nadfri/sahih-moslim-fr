"use server";

import { revalidatePath } from "next/cache";
import type { Chapter, Narrator, Sahaba } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";
import { slugify } from "@/src/utils/slugify";
import { AddItemFormValues, ItemType, VariantType } from "../types/types";

// --- Server-Side Validation Schemas (defined locally) ---
const serverBaseItemSchema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 lettres"),
  nameArabic: z.string().nullable().optional(),
});

const serverIndexValidation = {
  index: z
    .number()
    .int()
    .positive("L'index doit être un nombre entier positif"),
};

const serverAddItemChapterSchema = serverBaseItemSchema.extend(
  serverIndexValidation
);

const serverAddItemOtherSchema = serverBaseItemSchema;

const serverIdValidation = z.object({
  id: z.string().min(1, "L'ID est requis"),
});

const serverEditItemChapterSchema =
  serverAddItemChapterSchema.merge(serverIdValidation);

const serverEditItemOtherSchema =
  serverAddItemOtherSchema.merge(serverIdValidation);

// EditItemParams can remain similar if Edit forms also send a similar structure
type EditItemActionParams = AddItemFormValues & { id: string };

type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
  data?: ItemType;
};

// Define inferred types for schema outputs for clarity
type ServerAddItemChapterOutput = z.infer<typeof serverAddItemChapterSchema>;
type ServerAddItemOtherOutput = z.infer<typeof serverAddItemOtherSchema>;
type ServerEditItemChapterOutput = z.infer<typeof serverEditItemChapterSchema>;
type ServerEditItemOtherOutput = z.infer<typeof serverEditItemOtherSchema>;

// Define the explicit type for parseResult in addItem
type AddItemParseResultType =
  | z.SafeParseReturnType<AddItemFormValues, ServerAddItemChapterOutput>
  | z.SafeParseReturnType<AddItemFormValues, ServerAddItemOtherOutput>;

export async function addItem(
  variant: VariantType,
  data: AddItemFormValues
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  const parseResult: AddItemParseResultType =
    variant === "chapters"
      ? serverAddItemChapterSchema.safeParse(data)
      : serverAddItemOtherSchema.safeParse(data);

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
    if (variant === "chapters") {
      // validatedData is z.infer<typeof serverAddItemChapterSchema>
      const chapterData = validatedData as z.infer<
        typeof serverAddItemChapterSchema
      >;

      created = await prisma.chapter.create({
        data: {
          name: chapterData.name,
          index: chapterData.index,
          nameArabic: chapterData.nameArabic,
          slug: slug,
        },
      });
    } else if (variant === "narrators") {
      // On ignore l'index pour les narrateurs
      const narratorData = validatedData as z.infer<
        typeof serverAddItemOtherSchema
      >;
      created = await prisma.narrator.create({
        data: {
          name: narratorData.name,
          nameArabic: narratorData.nameArabic,
          slug: slug,
        },
      });
    } else {
      // On ignore l'index pour les sahabas
      const sahabaData = validatedData as z.infer<
        typeof serverAddItemOtherSchema
      >;
      created = await prisma.sahaba.create({
        data: {
          name: sahabaData.name,
          nameArabic: sahabaData.nameArabic,
          slug: slug,
        },
      });
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
        // Unique constraint violation
        const target = error.meta?.target as string[] | undefined;

        if (target?.includes("index")) {
          userMessage = "Ce index est déjà utilisé.";
        } else {
          userMessage = "Cet nom est déjà utilisé.";
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

// Define the explicit type for parseResult in editItem
type EditItemParseResultType =
  | z.SafeParseReturnType<EditItemActionParams, ServerEditItemChapterOutput>
  | z.SafeParseReturnType<EditItemActionParams, ServerEditItemOtherOutput>;

export async function editItem(
  variant: VariantType,
  data: EditItemActionParams
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  let parseResult: EditItemParseResultType; // Explicitly typed

  if (variant === "chapters") {
    parseResult = serverEditItemChapterSchema.safeParse(data);
  } else {
    parseResult = serverEditItemOtherSchema.safeParse(data);
  }

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

  const validatedData = parseResult.data; // Contains id and other fields (no slug)
  const { id, ...updateFields } = validatedData; // updateFields is { name, nameArabic, index? }
  const slug = slugify(updateFields.name); // Generate slug from name

  try {
    let updated: Chapter | Narrator | Sahaba;
    if (variant === "chapters") {
      // updateFields is Omit<z.infer<typeof serverEditItemChapterSchema>, "id">
      const chapterUpdateData = updateFields as Omit<
        z.infer<typeof serverEditItemChapterSchema>,
        "id"
      >;
      updated = await prisma.chapter.update({
        where: { id },
        data: {
          name: chapterUpdateData.name,
          index: chapterUpdateData.index,
          nameArabic: chapterUpdateData.nameArabic,
          slug: slug,
        },
      });
    } else if (variant === "narrators") {
      // updateFields is Omit<z.infer<typeof serverEditItemOtherSchema>, "id">
      const narratorUpdateData = updateFields as Omit<
        z.infer<typeof serverEditItemOtherSchema>,
        "id"
      >;
      updated = await prisma.narrator.update({
        where: { id },
        data: {
          name: narratorUpdateData.name,
          nameArabic: narratorUpdateData.nameArabic,
          slug: slug,
        },
      });
    } else {
      // updateFields is Omit<z.infer<typeof serverEditItemOtherSchema>, "id">
      const sahabaUpdateData = updateFields as Omit<
        z.infer<typeof serverEditItemOtherSchema>,
        "id"
      >;
      updated = await prisma.sahaba.update({
        where: { id },
        data: {
          name: sahabaUpdateData.name,
          nameArabic: sahabaUpdateData.nameArabic,
          slug: slug,
        },
      });
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
        if (target?.includes("name")) {
          userMessage = "Ce nom est déjà utilisé.";
        } else if (target?.includes("slug")) {
          userMessage = "Ce slug est déjà utilisé.";
        } else if (target?.includes("index")) {
          userMessage = "Cet index est déjà utilisé.";
        } else {
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

export async function deleteItem(
  variant: "chapters" | "narrators" | "sahabas",
  id: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
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
    if (variant === "chapters") {
      deleted = await prisma.chapter.delete({ where: { id } });
    } else if (variant === "narrators") {
      deleted = await prisma.narrator.delete({ where: { id } });
    } else {
      // sahabas
      deleted = await prisma.sahaba.delete({ where: { id } });
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
