-- ================================
-- ACTIVATION RLS (Row Level Security)
-- ================================

-- Activer RLS sur toutes les tables
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Hadith" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chapter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Narrator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Sahaba" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transmitter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HadithTransmitter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_HadithToSahaba" ENABLE ROW LEVEL SECURITY;

-- ================================
-- POLITIQUES RLS
-- ================================

-- Politique pour profiles : accès uniquement à son propre profil
CREATE POLICY "Users can view own profile" ON "profiles"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON "profiles"
  FOR UPDATE USING (auth.uid()::text = id);

-- Politiques pour les données publiques (lecture libre)
CREATE POLICY "Allow public read on Hadith" ON "Hadith"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on Chapter" ON "Chapter"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on Narrator" ON "Narrator"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on Sahaba" ON "Sahaba"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on Transmitter" ON "Transmitter"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on HadithTransmitter" ON "HadithTransmitter"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on _HadithToSahaba" ON "_HadithToSahaba"
  FOR SELECT USING (true);

-- Politiques admin pour modification des données (seulement pour les admins)
CREATE POLICY "Allow admin write on Hadith" ON "Hadith"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Allow admin write on Chapter" ON "Chapter"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Allow admin write on Narrator" ON "Narrator"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Allow admin write on Sahaba" ON "Sahaba"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Allow admin write on Transmitter" ON "Transmitter"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Allow admin write on HadithTransmitter" ON "HadithTransmitter"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Allow admin write on _HadithToSahaba" ON "_HadithToSahaba"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );
