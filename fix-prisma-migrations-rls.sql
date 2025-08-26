-- Activer RLS sur la table des migrations Prisma
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des migrations (pour que Prisma puisse fonctionner)
CREATE POLICY "Allow public read on _prisma_migrations" ON "_prisma_migrations"
  FOR SELECT USING (true);

-- Politique pour permettre l'écriture des migrations (pour les opérations Prisma)
CREATE POLICY "Allow service role write on _prisma_migrations" ON "_prisma_migrations"
  FOR ALL USING (true);
