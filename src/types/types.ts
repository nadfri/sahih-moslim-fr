import { z } from "zod";

export type FilterType = "word" | "narrator" | "sahaba";

export const SchemaItem = z.object({
  id: z.string(),
  index: z.number().nullable().optional(),
  name: z.string(),
  slug: z.string(),
  nameArabic: z.string().nullable().optional(),
  hadithCount: z.number().optional(),
});

export type ItemType = z.infer<typeof SchemaItem>;

export const HadithSchema = z.object({
  id: z.string(),
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  isnad: z.string().nullable().optional(),
  chapter: SchemaItem,
  narrator: SchemaItem,
  mentionedSahabas: z.array(SchemaItem),
});

export type HadithType = z.infer<typeof HadithSchema>;

export type ThemeType = "light" | "dark";

export type VariantType = "chapters" | "narrators" | "sahabas";
