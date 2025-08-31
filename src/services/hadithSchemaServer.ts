import { z } from "zod";

// =============================================================================
// SCHÉMAS DE VALIDATION CENTRALISÉS
// =============================================================================

// Schéma pour les hadiths (côté serveur)
export const hadithSchemaServer = z.object({
  numero: z.number().int().positive(),
  matn_fr: z.string().min(1, "Le texte français est requis"),
  matn_ar: z.string().min(1, "Le texte arabe est requis"),
  matn_en: z.string().optional(),
  chapter: z.string().min(1, "Le chapitre est requis"),
  mentionedSahabas: z.array(z.string()),
  isnadTransmitters: z.array(z.string()),
});

// Schéma pour les formulaires (avec coerce pour numero)
export const createHadithFormSchema = (
  existingNumeros: number[],
  initialNumero?: number
) => {
  return z.object({
    numero: z.coerce
      .number()
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" })
      .refine(
        (numero) =>
          initialNumero
            ? numero === initialNumero || !existingNumeros.includes(numero)
            : !existingNumeros.includes(numero),
        {
          message: "Ce numéro existe déjà. Veuillez en choisir un autre.",
        }
      ),
    chapter: z.string().min(1, "Le chapitre est requis"),
    mentionedSahabas: z.array(z.string()),
    isnadTransmitters: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    matn_en: z.string().optional(),
  });
};

export const createEditHadithSchema = (
  existingNumeros: number[],
  initialNumero: number
) => {
  return z.object({
    numero: z.coerce
      .number()
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" })
      .refine(
        (numero) =>
          numero === initialNumero || !existingNumeros.includes(numero),
        {
          message: "Ce numéro existe déjà. Veuillez en choisir un autre.",
        }
      ),
    chapter: z.string().min(1, "Le chapitre est requis"),
    mentionedSahabas: z.array(z.string()),
    isnadTransmitters: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    matn_en: z.string().optional(),
  });
};

export type HadithFormValues = z.infer<
  ReturnType<typeof createHadithFormSchema>
>;

export type EditHadithFormValues = z.infer<
  ReturnType<typeof createEditHadithSchema>
>;
