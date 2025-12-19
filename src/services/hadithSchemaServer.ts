import { z } from "zod";

import { BaseHadithContentSchema } from "../types/types";

// =============================================================================
// SCHÉMAS DE VALIDATION CENTRALISÉS
// =============================================================================

// Schéma pour les hadiths (côté serveur) dérivé du schéma partagé
export const ValidateHadithDataSchema = BaseHadithContentSchema.extend({
  numero: BaseHadithContentSchema.shape.numero.int().positive(),
  matn_fr: BaseHadithContentSchema.shape.matn_fr.min(
    1,
    "Le texte français est requis"
  ),
  matn_ar: BaseHadithContentSchema.shape.matn_ar.min(
    1,
    "Le texte arabe est requis"
  ),
  chapter: z.string().min(1, "Le chapitre est requis"),
  mentionedSahabas: z.array(z.string()),
  isnadTransmitters: z.array(z.string()),
});

// Unified schema for both creation and edition (with coerce for numero)
// Uniqueness validation is now handled server-side in actions
export const ValidateHadithFormSchema = () => {
  return BaseHadithContentSchema.extend({
    numero: z.coerce
      .number()
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" }),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    matn_en: z.string().min(1, "Le texte anglais est requis"),
    chapter: z.string().min(1, "Le chapitre est requis"),
    mentionedSahabas: z.array(z.string()),
    isnadTransmitters: z.array(z.string()),
  });
};

export type HadithFormValues = z.infer<
  ReturnType<typeof ValidateHadithFormSchema>
>;
