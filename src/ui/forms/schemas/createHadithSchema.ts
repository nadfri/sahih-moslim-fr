import { z } from "zod";

export const createHadithSchema = (existingNumeros: number[]) => {
  return z.object({
    numero: z.coerce
      .number()
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" })
      .refine((numero) => !existingNumeros.includes(numero), {
        message: "Ce numéro existe déjà. Veuillez en choisir un autre.",
      }),
    chapter: z.string().min(1, "Le chapitre est requis"),
    mentionedSahabas: z.array(z.string()),
    isnadTransmitters: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    matn_en: z.string().optional(),
    isnad: z.string().nullable().optional(),
  });
};

export type HadithFormValues = z.infer<ReturnType<typeof createHadithSchema>>;
