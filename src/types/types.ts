import { z } from "zod";

export type FilterType = "word" | "sahaba" | "transmitter" | "numero";
export type VariantType = "chapters" | "sahabas" | "transmitters";
export type ThemeType = "light" | "dark";

// --- Structural Schema (for ItemType, data representation) ---
export const SchemaItemStructure = z.object({
  id: z.string(),
  index: z.number().nullable().optional(),
  name: z.string(),
  slug: z.string(),
  nameArabic: z.string().nullable().optional(),
  hadithCount: z.number().optional(),
});
export type ItemType = z.infer<typeof SchemaItemStructure>;

export type ItemFormValues = Omit<ItemType, "id" | "slug" | "hadithCount">;

export const HadithSchema = z.object({
  id: z.string(),
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  matn_en: z.string().optional(),
  chapter: SchemaItemStructure,
  mentionedSahabas: z.array(SchemaItemStructure),
  isnadTransmitters: z.array(SchemaItemStructure),
});

export type HadithType = z.infer<typeof HadithSchema>;

// Schema for exported hadiths (what the export route emits)
export const ExportedHadithSchema = z.object({
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  matn_en: z.string().optional(),
  chapterIndex: z.number().optional(),
  chapterName: z.string().optional(),
  mentionedSahabas: z.array(z.string()).optional(),
  isnad: z.array(z.string()).optional(),
});

export type ExportedHadithType = z.infer<typeof ExportedHadithSchema>;

// Schema for imported hadiths (what the import route expects)
export const ImportedHadithSchema = z.object({
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  matn_en: z.string().optional(),
  // chapter can be identified either by slug or by index
  chapter: z
    .object({
      slug: z.string().optional(),
      index: z.number().optional(),
      name: z.string().optional(),
    })
    .optional(),
  // allow older export format: chapterIndex / chapterName at top level
  chapterIndex: z.number().optional(),
  chapterName: z.string().optional(),
  // mentionedSahabas can be an array of slugs (objects) or an array of names (strings)
  mentionedSahabas: z
    .array(
      z.union([
        z.object({ slug: z.string().optional(), name: z.string().optional() }),
        z.string(),
      ])
    )
    .optional(),
  // isnad: array of transmitter names (strings)
  isnad: z.array(z.string()).optional(),
});

export type ImportedHadithType = z.infer<typeof ImportedHadithSchema>;
