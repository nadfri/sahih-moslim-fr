import { z } from "zod";

export type FilterType =
  | "word"
  | "narrator"
  | "sahaba"
  | "transmitter"
  | "numero";
export type VariantType = "chapters" | "narrators" | "sahabas" | "transmitters";
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
  chapter: SchemaItemStructure,
  narrator: SchemaItemStructure,
  mentionedSahabas: z.array(SchemaItemStructure),
  isnadTransmitters: z.array(SchemaItemStructure),
});

export type HadithType = z.infer<typeof HadithSchema>;
