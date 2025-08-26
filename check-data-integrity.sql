-- Vérification de l'intégrité des données après migration
SELECT 
  'Hadith' as table_name, 
  COUNT(*) as count 
FROM "Hadith"
UNION ALL
SELECT 
  'Chapter' as table_name, 
  COUNT(*) as count 
FROM "Chapter"
UNION ALL
SELECT 
  'Narrator' as table_name, 
  COUNT(*) as count 
FROM "Narrator"
UNION ALL
SELECT 
  'Sahaba' as table_name, 
  COUNT(*) as count 
FROM "Sahaba"
UNION ALL
SELECT 
  'Transmitter' as table_name, 
  COUNT(*) as count 
FROM "Transmitter";
