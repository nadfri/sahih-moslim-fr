-- Supprimer les index B-tree problématiques
DROP INDEX IF EXISTS idx_hadith_matn_ar;
DROP INDEX IF EXISTS idx_hadith_matn_en;
DROP INDEX IF EXISTS idx_hadith_matn_fr;

-- Créer les index full-text pour la recherche rapide
CREATE INDEX IF NOT EXISTS idx_hadith_matn_ar_fts ON "Hadith" USING gin(to_tsvector('arabic', matn_ar));
CREATE INDEX IF NOT EXISTS idx_hadith_matn_fr_fts ON "Hadith" USING gin(to_tsvector('french', matn_fr));
CREATE INDEX IF NOT EXISTS idx_hadith_matn_en_fts ON "Hadith" USING gin(to_tsvector('english', matn_en));
