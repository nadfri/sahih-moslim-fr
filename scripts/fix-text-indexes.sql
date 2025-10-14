-- Migration pour remplacer les index B-tree par des index Full-Text Search
-- Cela résout le problème des textes longs tout en améliorant les performances de recherche

BEGIN;

-- 1. Supprimer les anciens index B-tree qui causent des problèmes
DROP INDEX IF EXISTS idx_hadith_matn_ar;
DROP INDEX IF EXISTS idx_hadith_matn_en;
DROP INDEX IF EXISTS idx_hadith_matn_fr;

-- 2. Créer des index Full-Text Search optimisés pour la recherche de mots
-- Index pour le texte arabe
CREATE INDEX idx_hadith_matn_ar_fts ON "Hadith" USING gin(to_tsvector('arabic', matn_ar));

-- Index pour le texte anglais  
CREATE INDEX idx_hadith_matn_en_fts ON "Hadith" USING gin(to_tsvector('english', matn_en));

-- Index pour le texte français
CREATE INDEX idx_hadith_matn_fr_fts ON "Hadith" USING gin(to_tsvector('french', matn_fr));

-- 3. Créer des index partiels sur les premiers caractères pour les recherches exactes
CREATE INDEX idx_hadith_matn_ar_partial ON "Hadith" (substring(matn_ar, 1, 100));
CREATE INDEX idx_hadith_matn_en_partial ON "Hadith" (substring(matn_en, 1, 100));
CREATE INDEX idx_hadith_matn_fr_partial ON "Hadith" (substring(matn_fr, 1, 100));

COMMIT;