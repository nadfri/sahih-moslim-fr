-- Vérifier les fonctions existantes
SELECT 
    schemaname,
    functionname,
    definition
FROM pg_functions 
WHERE schemaname = 'public' 
AND functionname LIKE '%search%';
