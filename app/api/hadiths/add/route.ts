import { promises as fs } from "fs";
import path from "path";
import { NextRequest } from "next/server";

import { chapters } from "@/db/chapterTitles";
import { narrators } from "@/db/narrators";
import { sahabas } from "@/db/sahabas";
import { HadithType } from "@/src/types/types";

export async function POST(request: NextRequest) {
  try {
    // Récupération des données du corps de la requête
    const newHadith: HadithType = await request.json();

    // Validation des données
    if (
      !newHadith.id ||
      !newHadith.chapter ||
      !newHadith.narrator ||
      !newHadith.matn
    ) {
      return Response.json(
        { success: false, message: "Données incomplètes" },
        { status: 400 }
      );
    }

    // Validation supplémentaire des types
    if (!chapters.includes(newHadith.chapter)) {
      return Response.json(
        { success: false, message: "Chapitre invalide" },
        { status: 400 }
      );
    }

    if (!narrators.includes(newHadith.narrator)) {
      return Response.json(
        { success: false, message: "Narrateur invalide" },
        { status: 400 }
      );
    }

    // Vérifier que tous les sahabas sont valides
    for (const sahaba of newHadith.sahabas) {
      if (!sahabas.includes(sahaba)) {
        return Response.json(
          { success: false, message: `Sahaba invalide: ${sahaba}` },
          { status: 400 }
        );
      }
    }

    // Chemin du fichier moslim_fr.ts
    const filePath = path.join(process.cwd(), "db", "moslim_fr.ts");

    // Lecture du contenu actuel du fichier
    const fileContent = await fs.readFile(filePath, "utf8");

    // Vérifier si l'ID existe déjà
    const idRegex = new RegExp(`id:\\s*${newHadith.id}\\b`, "g");
    if (idRegex.test(fileContent)) {
      return Response.json(
        {
          success: false,
          message: `L'ID ${newHadith.id} existe déjà`,
        },
        { status: 409 }
      ); // 409 Conflict
    }

    // Préparation du code du nouveau hadith à insérer
    const hadithToAdd = `
  {
    id: ${newHadith.id},
    chapter: "${newHadith.chapter}",
    narrator: "${newHadith.narrator}",
    sahabas: [${newHadith.sahabas.map((s) => `"${s}"`).join(", ")}],
    matn: ${JSON.stringify(newHadith.matn)},
    isnad: ${newHadith.isnad ? JSON.stringify(newHadith.isnad) : '""'},
    arabic: ${newHadith.arabic ? JSON.stringify(newHadith.arabic) : '""'},
  },
`; // Ajout d'un saut de ligne après la virgule

    // Trouver l'endroit où insérer le nouveau hadith (avant le dernier crochet fermant)
    const insertPosition = fileContent.lastIndexOf("];");
    if (insertPosition === -1) {
      return Response.json(
        { success: false, message: "Structure de fichier non reconnue" },
        { status: 500 }
      );
    }

    // Insérer le nouveau hadith
    const updatedContent =
      fileContent.slice(0, insertPosition) +
      hadithToAdd +
      fileContent.slice(insertPosition);

    // Écrire le fichier mis à jour
    await fs.writeFile(filePath, updatedContent, "utf8");

    return Response.json({
      success: true,
      message: `Hadith #${newHadith.id} ajouté avec succès`,
      data: newHadith,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du hadith:", error);
    return Response.json(
      {
        success: false,
        message: "Une erreur est survenue lors de l'ajout du hadith",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
