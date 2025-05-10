import { z } from "zod";

export type FilterType = "word" | "narrator" | "sahaba";

export const SchemaChapter = z.object({
  id: z.string(),
  index: z.number(),
  title: z.string(),
  slug: z.string(),
  hadithCount: z.number().optional(),
});

export type ChapterType = z.infer<typeof SchemaChapter>;

export const SchemaPerson = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  nameArabic: z.string().nullable().optional(),
  hadithCount: z.number().optional(),
});

export type PersonType = z.infer<typeof SchemaPerson>;

export const HadithSchema = z.object({
  id: z.string(),
  numero: z.number(),
  matn_fr: z.string(),
  matn_ar: z.string(),
  isnad: z.string().nullable().optional(),
  chapter: SchemaChapter,
  narrator: SchemaPerson,
  mentionedSahabas: z.array(SchemaPerson),
});

export type HadithType = z.infer<typeof HadithSchema>;

export type ThemeType = "light" | "dark";
