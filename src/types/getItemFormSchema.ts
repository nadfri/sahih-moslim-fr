import { z } from "zod";

import type { ItemType, VariantType } from "@/src/types/types";

export function getItemFormSchema(
  items: ItemType[],
  variant: VariantType,
  id?: string
) {
  return z.object({
    id: z.string().optional(),
    name_fr: z
      .string()
      .min(3, "Au moins 3 lettres")
      .trim()
      .refine(
        (name_fr) =>
          !items.some(
            (item) =>
              (id ? item.id !== id : true) &&
              item.name_fr.trim().toLowerCase() === name_fr.trim().toLowerCase()
          ),
        "Ce nom français est déjà utilisé. Veuillez en choisir un autre."
      ),
    name_ar: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional(),
    name_en: z
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
              index >= 0 &&
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
            "L'index doit être un entier non négatif et unique pour les chapitres",
        }
      ),
  });
}
