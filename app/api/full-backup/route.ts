import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { requireAdmin } from "@/src/lib/auth/auth";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) {
    return NextResponse.json(adminCheck, {
      status: adminCheck.success ? 200 : 401,
    });
  }

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

    // Force custom format dump (-Fc) and return binary .dump
    const backupFileName = `sahih-muslim-fr-backup-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.dump`;

    console.log("📤 Exécution de pg_dump -Fc (custom)...");

    // Commande pg_dump custom format
    const dumpCommand = `pg_dump "${dbUrl}" -Fc --no-owner --no-privileges --clean --if-exists --verbose`;

    console.log(`Commande: pg_dump "***" -Fc`);

    // Exécuter pg_dump avec PGPASSWORD
    const env = {
      ...process.env,
      PGPASSWORD: password,
      PGHOST: "",
      PGPORT: "",
      PGUSER: "",
      PGDATABASE: "",
    };
    const dumpBuffer = execSync(dumpCommand, {
      encoding: undefined,
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 200, // 200MB buffer for binary
      env: env,
    }) as Buffer;

    const fileSizeMB = (dumpBuffer.length / (1024 * 1024)).toFixed(2);
    console.log("✅ Backup .dump généré avec succès!");
    console.log(`📊 Taille: ${fileSizeMB} MB`);

    const body = new Uint8Array(dumpBuffer);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/octet-stream",
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

    // Force custom format for POST backups as well
    const ext = "dump";
    const backupFileName = `sahih-muslim-fr-backup-${timestamp}.${ext}`;

    console.log("📤 Exécution de pg_dump -Fc (custom)...");

    const dumpCommand = `pg_dump "${dbUrl}" -Fc --no-owner --no-privileges --clean --if-exists --verbose`;

    console.log(`Commande: pg_dump "***" -Fc`);

    const env2 = { ...process.env };
    try {
      const parsed = new URL(dbUrl);
      if (parsed.password) env2.PGPASSWORD = parsed.password;
    } catch {
      const match = dbUrl.match(/:\/\/([^:]+):([^@]+)@/);
      if (match) env2.PGPASSWORD = match[2];
    }

    const dumpBuffer = execSync(dumpCommand, {
      encoding: undefined,
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 200,
      env: env2,
    }) as Buffer;

    const fileSizeMB2 = (dumpBuffer.length / (1024 * 1024)).toFixed(2);
    console.log("✅ Backup .dump généré avec succès!");
    console.log(`📊 Taille: ${fileSizeMB2} MB`);

    const body2 = new Uint8Array(dumpBuffer);
    return new NextResponse(body2, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${backupFileName}"`,
      },
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
