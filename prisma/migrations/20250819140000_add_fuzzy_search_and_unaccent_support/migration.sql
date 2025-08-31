-- Enable required extensions for search
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full-text search index for French matn (simplified for tests)
CREATE INDEX IF NOT EXISTS hadith_matn_fr_fts_idx
ON "Hadith"
USING GIN (to_tsvector('simple', matn_fr));

-- Trigram similarity index for French (case insensitive only)
CREATE INDEX IF NOT EXISTS hadith_matn_fr_trgm_idx
ON "Hadith"
USING GIN (lower(matn_fr) gin_trgm_ops);

-- Trigram similarity index for Arabic (case insensitive)
CREATE INDEX IF NOT EXISTS hadith_matn_ar_trgm_idx
ON "Hadith"
USING GIN (lower(matn_ar) gin_trgm_ops);

