-- Enable required extensions for search
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full-text search index for French matn (unaccented)
CREATE INDEX IF NOT EXISTS hadith_matn_fr_fts_idx
ON "Hadith"
USING GIN (to_tsvector('french', unaccent(matn_fr)));

-- Trigram similarity index for French (case/accents insensitive)
CREATE INDEX IF NOT EXISTS hadith_matn_fr_trgm_idx
ON "Hadith"
USING GIN (unaccent(lower(matn_fr)) gin_trgm_ops);

-- Trigram similarity index for Arabic on diacritics-stripped normalized text
-- Simple trigram index for Arabic (without regex to keep IMMUTABLE-only functions)
CREATE INDEX IF NOT EXISTS hadith_matn_ar_trgm_idx
ON "Hadith"
USING GIN (lower(matn_ar) gin_trgm_ops);

