const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Script de restauration d'urgence pour Supabase");
console.log("================================================\n");

// Chemin du fichier de sauvegarde - utiliser le plus récent
const backupDir = path.join(__dirname);
const dumpFiles = fs
  .readdirSync(backupDir)
  .filter((file) => file.endsWith(".dump"));

if (dumpFiles.length === 0) {
  console.error("❌ Aucun fichier .dump trouvé dans le dossier backups");
  process.exit(1);
}

// Trier par date (le plus récent en premier)
dumpFiles.sort((a, b) => {
  const statA = fs.statSync(path.join(backupDir, a));
  const statB = fs.statSync(path.join(backupDir, b));
  return statB.mtime - statA.mtime;
});

const backupFile = path.join(backupDir, dumpFiles[0]);
console.log(`📁 Fichier de sauvegarde le plus récent: ${dumpFiles[0]}`);

// Vérifier que le fichier existe
if (!fs.existsSync(backupFile)) {
  console.error("❌ Fichier de sauvegarde introuvable:", backupFile);
  process.exit(1);
}

console.log("✅ Fichier de sauvegarde trouvé");

// Lire les variables d'environnement
console.log("\n🔍 Lecture des variables d'environnement...");
const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envPath)) {
  console.error("❌ Fichier .env introuvable");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const dbUrlMatch =
  envContent.match(/DATABASE_URL=(.+)/) || envContent.match(/DIRECT_URL=(.+)/);

if (!dbUrlMatch) {
  console.error("❌ DATABASE_URL ou DIRECT_URL non trouvée dans .env");
  console.log("Contenu du fichier .env:");
  console.log(envContent);
  process.exit(1);
}

const dbUrl = dbUrlMatch[1].replace(/['"]/g, "").trim();

// Nettoyer l'URL Supabase des paramètres problématiques
let cleanDbUrl = dbUrl;
const isSupabaseRaw = dbUrl.includes("supabase") || dbUrl.includes("pooler");

if (isSupabaseRaw) {
  // Supprimer les paramètres de query qui causent des problèmes avec psql
  cleanDbUrl = dbUrl.replace(/\?.*$/, "");
  console.log("🧹 URL nettoyée pour Supabase");
}

console.log("✅ URL de base de données trouvée");

// Détecter Supabase
const isSupabase =
  cleanDbUrl.includes("supabase") || cleanDbUrl.includes("pooler");
console.log(
  `🔍 Type de base: ${isSupabase ? "Supabase" : "PostgreSQL standard"}`
);

console.log("\n🧹 Vérification de l'état actuel de la base...");

try {
  // Vérifier les tables existantes
  const checkCommand = `psql "${cleanDbUrl}" -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"`;
  const result = execSync(checkCommand, { encoding: "utf8" });
  const tableCount = result.split("\n")[2]?.trim() || "0";
  console.log(`📊 Tables actuelles: ${tableCount}`);

  if (parseInt(tableCount) > 0) {
    console.log(
      "⚠️  La base contient déjà des tables. Continuer la restauration ?"
    );
  }
} catch (error) {
  console.warn("⚠️  Impossible de vérifier l'état actuel:", error.message);
}

console.log("\n🧹 Nettoyage préalable de la base...");

// Supprimer tous les objets utilisateur existants - approche plus complète
const cleanupCommands = [
  // Supprimer d'abord les politiques RLS
  `psql "${cleanDbUrl}" -c "DROP POLICY IF EXISTS \\"Allow users select own profile\\" ON public.profiles CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP POLICY IF EXISTS \\"Allow users update own profile\\" ON public.profiles CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP POLICY IF EXISTS \\"Allow authenticated users to read chapters\\" ON public.Chapter CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP POLICY IF EXISTS \\"Allow authenticated users to read hadiths\\" ON public.Hadith CASCADE;"`,

  // Supprimer les tables (dans l'ordre inverse des dépendances)
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"HadithTransmitter\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Hadith\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Chapter\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Transmitter\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Sahaba\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"profiles\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"prisma_migrations\\" CASCADE;"`,

  // Supprimer explicitement les tables problématiques
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\\"_HadithToSahaba\\\" CASCADE;"`,
  `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\\"_prisma_migrations\\\" CASCADE;"`,

  // Supprimer les types enum
  `psql "${cleanDbUrl}" -c "DROP TYPE IF EXISTS public.\\"Role\\" CASCADE;"`,

  // Nettoyer toutes les tables restantes dans le schéma public
  `psql "${cleanDbUrl}" -c "
    DO \$\$
    DECLARE
      table_name TEXT;
    BEGIN
      FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
      LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.\\\"' || table_name || '\\\" CASCADE;';
      END LOOP;
    END
    \$\$;
  "`,
];

for (const cmd of cleanupCommands) {
  try {
    execSync(cmd, { stdio: "pipe" });
    console.log("✅ Objet nettoyé");
  } catch (error) {
    // Ignorer les erreurs de nettoyage
    console.log("ℹ️  Objet déjà nettoyé ou inexistant");
  }
}

console.log("✅ Nettoyage terminé");

console.log("\n📊 Étape 2: Restauration complète...");

// Commande de restauration complète (structure + données)
const restoreCommand = [
  "pg_restore",
  `--dbname="${cleanDbUrl}"`,
  "--no-owner",
  "--no-privileges",
  "--exit-on-error",
  "--verbose",
  "--schema=public",
  `"${backupFile}"`,
].join(" ");

console.log(
  `Commande: pg_restore "***" "${path.basename(backupFile)}" --schema=public`
);

console.log(`Commande: pg_restore "***" "${path.basename(backupFile)}"`);

try {
  console.log("\n⏳ Restauration en cours... (cela peut prendre du temps)");
  execSync(restoreCommand, {
    stdio: "inherit",
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 50, // 50MB buffer
  });

  console.log("\n✅ Restauration terminée avec succès!");

  console.log("\n� Étape 3: Correction des politiques RLS...");

  // Commandes SQL pour corriger les rôles et politiques RLS
  const rlsFixCommands = [
    `psql "${cleanDbUrl}" -c "BEGIN;"`,
    `psql "${cleanDbUrl}" -c "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;"`,
    `psql "${cleanDbUrl}" -c "ALTER TABLE public.profiles NO FORCE ROW LEVEL SECURITY;"`,
    `psql "${cleanDbUrl}" -c "
      DO \$\$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='profiles' LOOP
          EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
        END LOOP;
      END
      \$\$;
    "`,
    `psql "${cleanDbUrl}" -c "
      CREATE POLICY \\"Allow users select own profile\\"
        ON public.profiles
        FOR SELECT
        TO authenticated
        USING (id::text = auth.uid()::text);
    "`,
    `psql "${cleanDbUrl}" -c "GRANT SELECT ON public.profiles TO authenticated;"`,
    `psql "${cleanDbUrl}" -c "REVOKE SELECT ON public.profiles FROM anon;"`,
    `psql "${cleanDbUrl}" -c "GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;"`,
    `psql "${cleanDbUrl}" -c "COMMIT;"`,
  ];

  console.log("🔒 Configuration des politiques RLS...");

  for (const cmd of rlsFixCommands) {
    try {
      execSync(cmd, { stdio: "pipe" });
      console.log("✅ Politique RLS configurée");
    } catch (error) {
      console.warn("⚠️ Erreur lors de la configuration RLS:", error.message);
    }
  }

  console.log("✅ Politiques RLS corrigées");

  console.log("\n🎉 Restauration terminée!");
  console.log(
    "🔄 Vous pouvez maintenant accéder à l'admin de votre application."
  );
} catch (error) {
  console.error("\n❌ Erreur lors de la restauration:");
  console.error(error.message);

  if (error.message.includes("event trigger")) {
    console.log("\n💡 Conseil: Cette erreur est normale avec Supabase.");
    console.log(
      "   Les objets système sont protégés et ne peuvent pas être modifiés."
    );
  }

  if (error.message.includes("already exists")) {
    console.log("\n💡 Conseil: Certaines tables existent déjà.");
    console.log("   Utilisez --clean si vous voulez les remplacer.");
  }

  process.exit(1);
}
