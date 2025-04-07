// app/api/hadith/[id]/edit/route.ts

import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

import { chapters } from "@/db/chapterTitles";
import { narrators } from "@/db/narrators";
import { sahabas } from "@/db/sahabas";
import {
  ChapterTitleType,
  HadithType,
  NarratorType,
  SahabaType,
} from "@/types/types";

type UpdateHadithRequestBody = Omit<HadithType, "id">;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const targetId = parseInt(params.id, 10);

    if (isNaN(targetId)) {
      return NextResponse.json(
        { success: false, message: "ID invalide fourni dans l'URL" },
        { status: 400 }
      );
    }

    const updatedHadithData: UpdateHadithRequestBody = await request.json();
    if (
      !updatedHadithData.chapter ||
      !updatedHadithData.narrator ||
      !updatedHadithData.matn ||
      !Array.isArray(updatedHadithData.sahabas)
    ) {
      return NextResponse.json(
        { success: false, message: "Données incomplètes" },
        { status: 400 }
      );
    }
    const chapterTitles = chapters.map((c) => c.title);
    if (
      !chapterTitles.includes(updatedHadithData.chapter as ChapterTitleType)
    ) {
      return NextResponse.json(
        { success: false, message: "Chapitre invalide" },
        { status: 400 }
      );
    }
    if (!narrators.includes(updatedHadithData.narrator as NarratorType)) {
      return NextResponse.json(
        { success: false, message: "Narrateur invalide" },
        { status: 400 }
      );
    }
    for (const sahaba of updatedHadithData.sahabas) {
      if (!sahabas.includes(sahaba as SahabaType)) {
        return NextResponse.json(
          { success: false, message: `Sahaba invalide: ${sahaba}` },
          { status: 400 }
        );
      }
    }

    const filePath = path.join(process.cwd(), "db", "moslim_fr.ts");
    const fileContent = await fs.readFile(filePath, "utf8");

    const startRegex = new RegExp(`\\{\\s*id:\\s*${targetId}\\b`);
    const match = fileContent.match(startRegex);

    if (!match || typeof match.index === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: `Hadith avec l'ID ${targetId} non trouvé (début)`,
        },
        { status: 404 }
      );
    }

    const startIndex = match.index;

    let braceCount = 0;
    let endIndex = -1;
    for (let i = startIndex; i < fileContent.length; i++) {
      if (fileContent[i] === "{") {
        braceCount++;
      } else if (fileContent[i] === "}") {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Structure de fichier invalide, impossible de trouver la fin du bloc hadith",
        },
        { status: 500 }
      );
    }

    const updatedHadithString = `  {
    id: ${targetId},
    chapter: "${updatedHadithData.chapter}",
    narrator: "${updatedHadithData.narrator}",
    sahabas: [${updatedHadithData.sahabas.map((s) => `"${s}"`).join(", ")}],
    matn: ${JSON.stringify(updatedHadithData.matn)},
    isnad: ${updatedHadithData.isnad ? JSON.stringify(updatedHadithData.isnad) : '""'},
    arabic: ${updatedHadithData.arabic ? JSON.stringify(updatedHadithData.arabic) : '""'},
  }`;
    const updatedContent =
      fileContent.substring(0, startIndex) +
      updatedHadithString +
      fileContent.substring(endIndex + 1);

    await fs.writeFile(filePath, updatedContent, "utf8");

    const finalUpdatedHadith: HadithType = {
      id: targetId,
      ...updatedHadithData,
    };

    return NextResponse.json({
      success: true,
      message: `Hadith #${targetId} modifié avec succès`,
      data: finalUpdatedHadith,
    });
  } catch (error) {
    console.error("Erreur lors de la modification du hadith:", error);
    let message = "Une erreur est survenue lors de la modification du hadith";
    let status = 500;
    if (error instanceof SyntaxError) {
      message = "Corps de la requête JSON invalide";
      status = 400;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      {
        success: false,
        message: message,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: status }
    );
  }
}
