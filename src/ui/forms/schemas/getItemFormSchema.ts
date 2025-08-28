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
    index: z
      .number()
      .optional()
      .nullable()
      .refine(
        (index) => {
          if (variant === "chapters") {
            return index !== null && index !== undefined;
          }
          return true;
        },
        { message: "L'index est requis pour les chapitres" }
      )
      .refine(
        (index) => {
          if (variant === "chapters" && index !== null && index !== undefined) {
            return (
              Number.isInteger(index) &&
              index > 0 &&
              !items.some(
                (chapter) =>
                  (id ? chapter.id !== id : true) && chapter.index === index
              )
            );
          }
          return true;
        },
        {
          message:
            "L'index doit être un nombre entier positif et unique pour les chapitres",
        }
      ),
  });
}
