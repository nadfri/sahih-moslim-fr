import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Restauration PostgreSQL complète...");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No backup file provided" },
        { status: 400 }
      );
    }

    // Vérifier que c'est un fichier .sql
    if (!file.name.endsWith(".sql")) {
      return NextResponse.json(
        {
          error:
            "Le fichier de backup doit être un fichier .sql généré par pg_dump",
        },
        { status: 400 }
      );
    }

    console.log(`📁 Fichier source: ${file.name}`);

    // Sauvegarder temporairement le fichier
    const tempDir = "/tmp";
    const tempFilePath = `${tempDir}/restore-${Date.now()}.sql`;

    // Écrire le fichier uploadé dans un fichier temporaire
    const fileContent = await file.text();
    fs.writeFileSync(tempFilePath, fileContent);

    console.log(`📁 Fichier temporaire: ${tempFilePath}`);

    // Obtenir l'URL de la base de données cible
    // Utiliser DIRECT_URL si disponible (pour Supabase), sinon DATABASE_URL
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error(
        "DATABASE_URL ou DIRECT_URL n'est pas définie dans les variables d'environnement"
      );
    }

    console.log("🧹 Préparation de la base de données...");

    // Nettoyer la base de données avant la restauration
    // Attention: cela supprime TOUTES les données existantes
    const cleanCommands = [
      `psql "${dbUrl}" -c "DROP SCHEMA public CASCADE;"`,
      `psql "${dbUrl}" -c "CREATE SCHEMA public;"`,
      `psql "${dbUrl}" -c "GRANT ALL ON SCHEMA public TO postgres;"`,
      `psql "${dbUrl}" -c "GRANT ALL ON SCHEMA public TO public;"`,
    ];

    for (const cmd of cleanCommands) {
      try {
        execSync(cmd, {
          stdio: "inherit",
          cwd: process.cwd(),
        });
      } catch {
        // Ignorer les erreurs de nettoyage (peut-être que le schéma n'existe pas)
      }
    }

    console.log("✅ Base de données nettoyée");

    console.log("📥 Restauration des données...");

    // Restaurer le dump SQL
    const restoreCommand = `psql "${dbUrl}" < "${tempFilePath}"`;

    console.log(`Commande: psql "***" < "${tempFilePath}"`);

    execSync(restoreCommand, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Nettoyer le fichier temporaire
    fs.unlinkSync(tempFilePath);

    console.log("✅ Restauration PostgreSQL terminée avec succès!");
    console.log(`⏰ Restauré le: ${new Date().toLocaleString()}`);
    console.log(`📁 Depuis: ${file.name}`);

    console.log(
      "\n⚠️  ATTENTION: Toutes les données précédentes ont été supprimées!"
    );

    return NextResponse.json({
      message: "Database restored successfully from PostgreSQL backup",
      restoredAt: new Date().toISOString(),
      backupFile: file.name,
      warning: "Toutes les données précédentes ont été supprimées",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la restauration PostgreSQL:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to restore PostgreSQL database", details: errorMessage },
      { status: 500 }
    );
  }
}
