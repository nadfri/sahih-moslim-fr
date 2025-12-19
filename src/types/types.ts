import { Locale } from "next-intl";
import { z } from "zod";

export type FilterType = "word" | "sahaba" | "transmitter" | "numero";
export type VariantType = "chapters" | "sahabas" | "transmitters";
export type ThemeType = "light" | "dark" | null;
export type ParamsLocale = Promise<{ locale: Locale }>;
export type ParamsSlug = ParamsLocale & Promise<{ slug: string }>;
export type ParamsNumero = ParamsLocale & Promise<{ numero: string }>;

// --- Structural Schema (for ItemType, data representation) ---
export const SchemaItemStructure = z.object({
  id: z.string(),
  index: z.number().nullable().optional(),
  name_fr: z.string(),
  name_ar: z.string().nullable().optional(),
  name_en: z.string().nullable().optional(),
  slug: z.string(),
  hadithCount: z.number().optional(),
});
export type ItemType = z.infer<typeof SchemaItemStructure>;

// Permissive schema for imports/preview: id, slug, index, and hadithCount are optional
export const ImportItemSchema = SchemaItemStructure.partial({
  id: true,
  slug: true,
  index: true,
  hadithCount: true,
});
export type ImportItemType = z.infer<typeof ImportItemSchema>;

// Schema for chapter imports where `index` must be present.
export const ChapterImportSchema = ImportItemSchema.extend({
  index: z.number(),
});
export type ChapterImportType = z.infer<typeof ChapterImportSchema>;

// Form values schema using Zod .omit() instead of TypeScript Omit
export const ItemFormValuesSchema = SchemaItemStructure.omit({
  id: true,
  slug: true,
  hadithCount: true,
});
export type ItemFormValues = z.infer<typeof ItemFormValuesSchema>;

// Base schema for hadith content (shared across all hadith schemas)
export const BaseHadithContentSchema = z.object({
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  matn_en: z.string().optional(),
});

// Complete hadith schema for display/internal use
export const HadithSchema = BaseHadithContentSchema.extend({
  id: z.string(),
  chapter: SchemaItemStructure,
  mentionedSahabas: z.array(SchemaItemStructure),
  isnadTransmitters: z.array(SchemaItemStructure),
});

export type HadithType = z.infer<typeof HadithSchema>;

// Schema for exported hadiths (what the export route emits)
export const ExportedHadithSchema = BaseHadithContentSchema.extend({
  chapterIndex: z.number().optional(),
  chapterName: z.string().optional(),
  mentionedSahabas: z.array(z.string()).optional(),
  isnad: z.array(z.string()).optional(),
});

export type ExportedHadithType = z.infer<typeof ExportedHadithSchema>;

// Schema for imported hadiths (what the import route expects)
export const ImportedHadithSchema = BaseHadithContentSchema.extend({
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
