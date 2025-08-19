-- Vérification des extensions et index existants
-- Extensions disponibles
SELECT extname, extversion 
FROM pg_extension 
WHERE extname IN ('pg_trgm', 'unaccent');

-- Index sur la table Hadith
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'Hadith'
ORDER BY indexname;
