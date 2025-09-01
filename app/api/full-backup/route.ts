import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    console.log("📥 Génération et téléchargement du backup PostgreSQL...");

    // En production (Vercel), on génère le backup à la volée
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error(
        "DATABASE_URL ou DIRECT_URL n'est pas définie dans les variables d'environnement"
      );
    }

    // Extraire le mot de passe de l'URL pour PGPASSWORD
    let password = "";
    try {
      const url = new URL(dbUrl);
      password = url.password;
    } catch {
      // Si l'URL n'est pas dans le bon format, essayer d'extraire manuellement
      const match = dbUrl.match(/:\/\/([^:]+):([^@]+)@/);
      if (match) {
        password = match[2];
      }
    }

    if (!password) {
      throw new Error(
        "Mot de passe non trouvé dans l'URL de la base de données"
      );
    }

    // Générer le nom du fichier avec date et heure complètes
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const backupFileName = `sahih-muslim-fr-backup-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.sql`;

    console.log("📤 Exécution de pg_dump...");

    // Commande pg_dump avec l'URL complète
    const dumpCommand = `pg_dump "${dbUrl}" --no-owner --no-privileges --clean --if-exists --verbose`;

    console.log(
      `Commande: pg_dump "***" --no-owner --no-privileges --clean --if-exists --verbose`
    );

    // Exécuter pg_dump avec PGPASSWORD
    const env = {
      ...process.env,
      PGPASSWORD: password,
      // S'assurer que pg_dump n'essaie pas de se connecter localement
      PGHOST: "",
      PGPORT: "",
      PGUSER: "",
      PGDATABASE: "",
    };
    const sqlContent = execSync(dumpCommand, {
      encoding: "utf8",
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 50, // 50MB buffer
      env: env,
    });

    console.log("✅ Backup généré avec succès en mémoire");
    console.log(
      `📊 Taille: ${(Buffer.byteLength(sqlContent, "utf8") / (1024 * 1024)).toFixed(2)} MB`
    );

    // Retourner le contenu SQL directement
    return new NextResponse(sqlContent, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="${backupFileName}"`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors du téléchargement du backup:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Retourner une erreur plus détaillée
    return NextResponse.json(
      {
        error: "Failed to download backup",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log("🚀 Création du backup PostgreSQL complet...");

    // En production (Vercel), on ne peut pas sauvegarder sur le système de fichiers
    // On génère juste le backup et on confirme qu'il fonctionne
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error(
        "DATABASE_URL ou DIRECT_URL n'est pas définie dans les variables d'environnement"
      );
    }

    // Générer le nom du fichier
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const backupFileName = `sahih-muslim-fr-backup-${timestamp}.sql`;

    console.log("📤 Test de pg_dump...");

    // Commande pg_dump qui écrit dans stdout pour vérifier que ça fonctionne
    const dumpCommand = `pg_dump "${dbUrl}" --no-owner --no-privileges --clean --if-exists --verbose`;

    console.log(
      `Commande: pg_dump "***" --no-owner --no-privileges --clean --if-exists --verbose`
    );

    // Exécuter pg_dump et capturer la sortie
    const sqlContent = execSync(dumpCommand, {
      encoding: "utf8",
      cwd: process.cwd(),
    });

    const fileSizeMB = (
      Buffer.byteLength(sqlContent, "utf8") /
      (1024 * 1024)
    ).toFixed(2);

    console.log("✅ Backup PostgreSQL testé avec succès!");
    console.log(`📊 Taille estimée: ${fileSizeMB} MB`);
    console.log(`📅 Généré le: ${new Date().toLocaleString()}`);

    return NextResponse.json({
      success: true,
      filename: backupFileName,
      size: `${fileSizeMB} MB`,
      createdAt: new Date().toISOString(),
      message: "Backup PostgreSQL généré avec succès (en mémoire)",
      note: "Utilisez 'Télécharger Backup' pour obtenir le fichier SQL",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création du backup PostgreSQL:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create PostgreSQL backup", details: errorMessage },
      { status: 500 }
    );
  }
}
