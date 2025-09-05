#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

console.log("🚀 Script de restauration d'urgence pour Supabase - v2.0");
console.log("🔄 Compatible avec le nouveau schéma Prisma simplifié");
console.log("📊 Support des relations Many-to-Many Hadith <-> Sahaba");
console.log("=======================================================\n");

// Fonction pour créer une interface interactive
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Fonction pour poser une question à l'utilisateur
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Chemin du fichier de sauvegarde
const backupDir = path.join(__dirname);
const dumpFiles = fs
  .readdirSync(backupDir)
  .filter((file) => file.endsWith(".dump") || file.endsWith(".sql"));

if (dumpFiles.length === 0) {
  console.error(
    "❌ Aucun fichier .dump ou .sql trouvé dans le dossier backups"
  );
  process.exit(1);
}

// Trier par date (le plus récent en premier)
dumpFiles.sort((a, b) => {
  const statA = fs.statSync(path.join(backupDir, a));
  const statB = fs.statSync(path.join(backupDir, b));
  return statB.mtime - statA.mtime;
});

console.log(`📁 Fichiers de sauvegarde disponibles (${dumpFiles.length}):`);
dumpFiles.forEach((file, index) => {
  const filePath = path.join(backupDir, file);
  const stats = fs.statSync(filePath);
  const size = (stats.size / 1024 / 1024).toFixed(2);
  const date = stats.mtime.toLocaleString("fr-FR");
  console.log(`  ${index + 1}. ${file} (${size} MB) - ${date}`);
});

let backupFile;

async function selectBackupFile() {
  if (dumpFiles.length === 1) {
    console.log("\n📁 Un seul fichier trouvé, utilisation automatique");
    backupFile = path.join(backupDir, dumpFiles[0]);
  } else {
    const rl = createInterface();

    try {
      const choice = await askQuestion(
        rl,
        `\n🔍 Choisissez un fichier (1-${dumpFiles.length}) ou appuyez Entrée pour le plus récent: `
      );

      if (choice === "" || choice === "1") {
        backupFile = path.join(backupDir, dumpFiles[0]);
        console.log(
          `📁 Utilisation du fichier le plus récent: ${dumpFiles[0]}`
        );
      } else {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < dumpFiles.length) {
          backupFile = path.join(backupDir, dumpFiles[index]);
          console.log(
            `📁 Utilisation du fichier sélectionné: ${dumpFiles[index]}`
          );
        } else {
          console.error(`❌ Choix invalide: ${choice}`);
          rl.close();
          process.exit(1);
        }
      }
    } finally {
      rl.close();
    }
  }
}

// Exécuter la sélection du fichier
selectBackupFile()
  .then(() => {
    // Continuer avec le reste du script...
    checkBackupFile();
  })
  .catch((error) => {
    console.error("❌ Erreur lors de la sélection du fichier:", error.message);
    process.exit(1);
  });

function checkBackupFile() {
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
    envContent.match(/DATABASE_URL=(.+)/) ||
    envContent.match(/DIRECT_URL=(.+)/);

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
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"_HadithToSahaba\\" CASCADE;"`,
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Hadith\\" CASCADE;"`,
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Chapter\\" CASCADE;"`,
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Transmitter\\" CASCADE;"`,
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"Sahaba\\" CASCADE;"`,
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"profiles\\" CASCADE;"`,
    `psql "${cleanDbUrl}" -c "DROP TABLE IF EXISTS public.\\"_prisma_migrations\\" CASCADE;"`,

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

    console.log("\n🔗 Ajout des relations et indexes...");

    // Script SQL pour relations et indexes
    const relationsAndIndexesSQL = `
    -- Suppression des indexes en doublon
    DROP INDEX IF EXISTS "Chapter_name_idx";
    DROP INDEX IF EXISTS "idx_chapter_name";
    DROP INDEX IF EXISTS "Chapter_slug_idx";
    DROP INDEX IF EXISTS "idx_chapter_slug";
    DROP INDEX IF EXISTS "Chapter_index_idx";
    DROP INDEX IF EXISTS "idx_chapter_index";
    DROP INDEX IF EXISTS "Hadith_chapterId_idx";
    DROP INDEX IF EXISTS "idx_hadith_chapterid";
    DROP INDEX IF EXISTS "Hadith_chapterId_numero_idx";
    DROP INDEX IF EXISTS "idx_hadith_chapterid_numero";
    DROP INDEX IF EXISTS "Hadith_matn_fr_idx";
    DROP INDEX IF EXISTS "idx_hadith_matn_fr";
    DROP INDEX IF EXISTS "Hadith_matn_ar_idx";
    DROP INDEX IF EXISTS "idx_hadith_matn_ar";
    DROP INDEX IF EXISTS "Hadith_matn_en_idx";
    DROP INDEX IF EXISTS "idx_hadith_matn_en";
    DROP INDEX IF EXISTS "Hadith_numero_idx";
    DROP INDEX IF EXISTS "idx_hadith_numero";
    DROP INDEX IF EXISTS "HadithTransmitter_hadithId_idx";
    DROP INDEX IF EXISTS "idx_ht_hadithid";
    DROP INDEX IF EXISTS "HadithTransmitter_transmitterId_idx";
    DROP INDEX IF EXISTS "idx_ht_transmitterid";
    DROP INDEX IF EXISTS "Sahaba_name_idx";
    DROP INDEX IF EXISTS "idx_sahaba_name";
    DROP INDEX IF EXISTS "Sahaba_slug_idx";
    DROP INDEX IF EXISTS "idx_sahaba_slug";
    DROP INDEX IF EXISTS "Transmitter_name_idx";
    DROP INDEX IF EXISTS "idx_transmitter_name";
    DROP INDEX IF EXISTS "Transmitter_slug_idx";
    DROP INDEX IF EXISTS "idx_transmitter_slug";

    -- Création de l'enum Role si absent
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
      END IF;
    END $$;

    -- Foreign key Hadith.chapterId -> Chapter.id
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_hadith_chapter' AND table_name = 'Hadith'
      ) THEN
        ALTER TABLE public."Hadith"
          ADD CONSTRAINT fk_hadith_chapter FOREIGN KEY ("chapterId") REFERENCES public."Chapter"(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
      END IF;
    END $$;

    -- Foreign key HadithTransmitter.hadithId -> Hadith.id
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_ht_hadith' AND table_name = 'HadithTransmitter'
      ) THEN
        ALTER TABLE public."HadithTransmitter"
          ADD CONSTRAINT fk_ht_hadith FOREIGN KEY ("hadithId") REFERENCES public."Hadith"(id) ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;

    -- Foreign key HadithTransmitter.transmitterId -> Transmitter.id
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_ht_transmitter' AND table_name = 'HadithTransmitter'
      ) THEN
        ALTER TABLE public."HadithTransmitter"
          ADD CONSTRAINT fk_ht_transmitter FOREIGN KEY ("transmitterId") REFERENCES public."Transmitter"(id) ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;

    -- Foreign keys pour _HadithToSahaba (relation many-to-many simplifiée)
    DO $$
    BEGIN
      -- Vérifier que la table _HadithToSahaba existe
      IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = '_HadithToSahaba'
      ) THEN
        -- Foreign key A -> Hadith.id
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = '_HadithToSahaba_A_fkey' AND table_name = '_HadithToSahaba'
        ) THEN
          ALTER TABLE public."_HadithToSahaba"
            ADD CONSTRAINT "_HadithToSahaba_A_fkey" FOREIGN KEY ("A") REFERENCES public."Hadith"(id) ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        -- Foreign key B -> Sahaba.id
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = '_HadithToSahaba_B_fkey' AND table_name = '_HadithToSahaba'
        ) THEN
          ALTER TABLE public."_HadithToSahaba"
            ADD CONSTRAINT "_HadithToSahaba_B_fkey" FOREIGN KEY ("B") REFERENCES public."Sahaba"(id) ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END IF;
    END $$;

    -- Indexes optimisés selon le nouveau schéma Prisma
    CREATE INDEX IF NOT EXISTS "idx_hadith_chapterid" ON public."Hadith"("chapterId");
    CREATE INDEX IF NOT EXISTS "idx_hadith_numero" ON public."Hadith"("numero");
    CREATE INDEX IF NOT EXISTS "idx_hadith_chapterid_numero" ON public."Hadith"("chapterId", "numero");
    CREATE INDEX IF NOT EXISTS "idx_hadith_matn_fr" ON public."Hadith"("matn_fr");
    CREATE INDEX IF NOT EXISTS "idx_hadith_matn_ar" ON public."Hadith"("matn_ar");
    CREATE INDEX IF NOT EXISTS "idx_hadith_matn_en" ON public."Hadith"("matn_en");
    
    CREATE INDEX IF NOT EXISTS "idx_chapter_index" ON public."Chapter"("index");
    CREATE INDEX IF NOT EXISTS "idx_chapter_slug" ON public."Chapter"("slug");
    CREATE INDEX IF NOT EXISTS "idx_chapter_name_fr" ON public."Chapter"("name_fr");
    CREATE INDEX IF NOT EXISTS "idx_chapter_name_ar" ON public."Chapter"("name_ar");
    CREATE INDEX IF NOT EXISTS "idx_chapter_name_en" ON public."Chapter"("name_en");
    
    CREATE INDEX IF NOT EXISTS "idx_sahaba_slug" ON public."Sahaba"("slug");
    CREATE INDEX IF NOT EXISTS "idx_sahaba_name_fr" ON public."Sahaba"("name_fr");
    CREATE INDEX IF NOT EXISTS "idx_sahaba_name_ar" ON public."Sahaba"("name_ar");
    CREATE INDEX IF NOT EXISTS "idx_sahaba_name_en" ON public."Sahaba"("name_en");
    
    CREATE INDEX IF NOT EXISTS "idx_transmitter_slug" ON public."Transmitter"("slug");
    CREATE INDEX IF NOT EXISTS "idx_transmitter_name_fr" ON public."Transmitter"("name_fr");
    CREATE INDEX IF NOT EXISTS "idx_transmitter_name_ar" ON public."Transmitter"("name_ar");
    CREATE INDEX IF NOT EXISTS "idx_transmitter_name_en" ON public."Transmitter"("name_en");
    
    CREATE INDEX IF NOT EXISTS "idx_ht_hadithid" ON public."HadithTransmitter"("hadithId");
    CREATE INDEX IF NOT EXISTS "idx_ht_transmitterid" ON public."HadithTransmitter"("transmitterId");
    
    -- Index spécial pour la table de jointure _HadithToSahaba
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = '_HadithToSahaba'
      ) THEN
        CREATE INDEX IF NOT EXISTS "_HadithToSahaba_B_index" ON public."_HadithToSahaba"("B");
      END IF;
    END $$;

    -- Contraintes uniques nécessaires
    DO $$
    BEGIN
      -- Contrainte unique pour HadithTransmitter
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'HadithTransmitter_hadithId_transmitterId_key' AND table_name = 'HadithTransmitter'
      ) THEN
        ALTER TABLE public."HadithTransmitter"
          ADD CONSTRAINT "HadithTransmitter_hadithId_transmitterId_key" UNIQUE ("hadithId", "transmitterId");
      END IF;
      
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'HadithTransmitter_hadithId_order_key' AND table_name = 'HadithTransmitter'
      ) THEN
        ALTER TABLE public."HadithTransmitter"
          ADD CONSTRAINT "HadithTransmitter_hadithId_order_key" UNIQUE ("hadithId", "order");
      END IF;
    END $$;
    `;

    // Exécution du script SQL via psql
    try {
      // Écrire le SQL dans un fichier temporaire
      const sqlFilePath = path.join(__dirname, "relations_and_indexes.sql");
      fs.writeFileSync(sqlFilePath, relationsAndIndexesSQL, {
        encoding: "utf8",
      });
      // Exécuter le fichier avec psql
      const execIndexCmd = `psql "${cleanDbUrl}" -v ON_ERROR_STOP=1 -f "${sqlFilePath}"`;
      execSync(execIndexCmd, { stdio: "inherit" });
      // Supprimer le fichier temporaire
      fs.unlinkSync(sqlFilePath);
      console.log("✅ Relations et indexes ajoutés");
    } catch (error) {
      console.warn(
        "⚠️ Erreur lors de l'ajout des relations/indexes:",
        error.message
      );
    }

    console.log("\n🎉 Restauration terminée!");
    console.log(
      "🔄 Exécution de `prisma generate` pour synchroniser le client..."
    );

    // Exécuter prisma generate pour s'assurer que le client est à jour
    try {
      const generateCommand = "cd .. && npx prisma generate";
      execSync(generateCommand, { stdio: "inherit" });
      console.log("✅ Prisma Client généré avec succès");
    } catch (error) {
      console.warn(
        "⚠️ Erreur lors de la génération du client Prisma:",
        error.message
      );
      console.log("💡 Vous pouvez exécuter manuellement: npx prisma generate");
    }

    console.log("\n📊 Vérification finale...");

    // Vérification finale des données
    try {
      const verifyCommands = [
        `psql "${cleanDbUrl}" -c "SELECT COUNT(*) as hadith_count FROM public.\\"Hadith\\";"`,
        `psql "${cleanDbUrl}" -c "SELECT COUNT(*) as sahaba_count FROM public.\\"Sahaba\\";"`,
        `psql "${cleanDbUrl}" -c "SELECT COUNT(*) as chapter_count FROM public.\\"Chapter\\";"`,
        `psql "${cleanDbUrl}" -c "SELECT COUNT(*) as transmitter_count FROM public.\\"Transmitter\\";"`,
      ];

      console.log("📈 Statistiques de la base restaurée:");
      verifyCommands.forEach((cmd) => {
        try {
          const result = execSync(cmd, { encoding: "utf8" });
          const lines = result.split("\n");
          const countLine = lines.find(
            (line) =>
              line.trim() && !line.includes("-") && !line.includes("count")
          );
          if (countLine) {
            const tableName = cmd.includes("hadith")
              ? "Hadiths"
              : cmd.includes("sahaba")
                ? "Sahabas"
                : cmd.includes("chapter")
                  ? "Chapitres"
                  : "Transmetteurs";
            console.log(`   - ${tableName}: ${countLine.trim()}`);
          }
        } catch (error) {
          console.log(`   - Erreur lors de la vérification`);
        }
      });
    } catch (error) {
      console.warn("⚠️ Impossible de vérifier les statistiques");
    }

    console.log("\n🎉 Restauration complète terminée!");
    console.log("🔄 Vous pouvez maintenant :");
    console.log("   1. Accéder à l'admin de votre application");
    console.log(
      "   2. Vérifier que les relations Hadith <-> Sahaba fonctionnent"
    );
    console.log(
      "   3. Tester les fonctionnalités multilingues (name_fr, name_en, name_ar)"
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
}
