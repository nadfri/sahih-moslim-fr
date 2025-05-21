import { z } from "zod";

import type { ItemType, VariantType } from "@/src/types/types";

export function getItemFormSchema(
  items: ItemType[],
  variant: VariantType,
  id?: string
) {
  return z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(3, "Au moins 3 lettres")
      .trim()
      .refine(
        (name) =>
          !items.some(
            (item) =>
              (id ? item.id !== id : true) &&
              item.name.trim().toLowerCase() === name.trim().toLowerCase()
          ),
        "Ce nom est déjà utilisé. Veuillez en choisir un autre."
      ),
    nameArabic: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional(),
    index:
      variant === "chapters"
        ? z.coerce
            .number({ message: "L'index est requis" })
            .int({ message: "L'index doit être un nombre entier" })
            .positive({ message: "L'index doit être un nombre positif" })
            .refine(
              (index) =>
                !items.some(
                  (chapter) =>
                    (id ? chapter.id !== id : true) && chapter.index === index
                ),
              "Cet index est déjà utilisé. Veuillez en choisir un autre."
            )
        : z.number().optional().nullable(),
  });
}
