-- 🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋
-- PostgreSQL Performance Optimization - Simple and Fast Indexes

-- Enable pg_trgm for ILIKE acceleration
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create simple trigram indexes for ILIKE operations
-- These will dramatically speed up pattern matching

-- 1. Trigram index for French text (case-sensitive, will help with ILIKE)
DROP INDEX IF EXISTS idx_hadith_matn_fr_trgm;
CREATE INDEX idx_hadith_matn_fr_trgm 
ON "Hadith" 
USING gin(matn_fr gin_trgm_ops);

-- 2. Trigram index for Arabic text
DROP INDEX IF EXISTS idx_hadith_matn_ar_trgm;
CREATE INDEX idx_hadith_matn_ar_trgm 
ON "Hadith" 
USING gin(matn_ar gin_trgm_ops);

-- 3. Index for numero (for ordering)
DROP INDEX IF EXISTS idx_hadith_numero_order;
CREATE INDEX idx_hadith_numero_order 
ON "Hadith" (numero ASC);

-- 4. Index for text length (for relevance ordering)
DROP INDEX IF EXISTS idx_hadith_matn_fr_length;
CREATE INDEX idx_hadith_matn_fr_length 
ON "Hadith" (length(matn_fr));

-- 5. Composite index for JOINs
DROP INDEX IF EXISTS idx_hadith_joins;
CREATE INDEX idx_hadith_joins 
ON "Hadith" ("chapterId", "narratorId");

-- Update table statistics for optimal query planning
ANALYZE "Hadith";
ANALYZE "Chapter";
ANALYZE "Narrator";
