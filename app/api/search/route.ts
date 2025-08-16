/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { NextRequest, NextResponse } from "next/server";

import {
  searchHadithsByNarrator,
  searchHadithsBySahabas,
  searchHadithsByTransmitters,
  searchHadithsCombined,
  SearchResult,
} from "@/src/services/searchServices";
import { getHadithByNumero } from "@/src/services/services";
import { HadithType } from "@/src/types/types";

// Type for API response that can handle both SearchResult and HadithType
type ApiSearchResult =
  | (SearchResult & { rank?: number })
  | (HadithType & { rank?: number });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filterMode = searchParams.get("filterMode") || "word";
    const query = searchParams.get("query") || "";
    const narrator = searchParams.get("narrator") || "";
    const sahabas = searchParams.getAll("sahaba");
    const transmitters = searchParams.getAll("transmitter");
    const numero = searchParams.get("numero") || "";
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "100");

    let results: ApiSearchResult[] = [];

    switch (filterMode) {
      case "word":
        if (query.length >= 3) {
          // Use PostgreSQL search with word mode
          const searchResults = await searchHadithsCombined(query, "word", limit);

          // Transform SearchResult to HadithType format
          results = searchResults.map((result) => ({
            id: result.id,
            numero: result.numero,
            matn_fr: result.matn_fr,
            matn_ar: result.matn_ar,
            chapter: result.chapter,
            narrator: result.narrator,
            chapterId: result.chapter.id,
            narratorId: result.narrator.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mentionedSahabas: [],
            isnadTransmitters: [],
            rank: result.rank,
          }));
        }
        break;

      case "narrator":
        if (narrator) {
          results = await searchHadithsByNarrator(narrator, offset, limit);
        }
        break;

      case "sahaba":
        if (sahabas.length > 0) {
          results = await searchHadithsBySahabas(sahabas, offset, limit);
        }
        break;

      case "transmitter":
        if (transmitters.length > 0) {
          results = await searchHadithsByTransmitters(
            transmitters,
            offset,
            limit
          );
        }
        break;

      case "numero":
        if (numero && !isNaN(Number(numero))) {
          const hadith = await getHadithByNumero(numero);
          results = hadith ? [hadith] : [];
        }
        break;

      default:
        results = [];
    }

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
      hasMore: results.length === limit,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        results: [],
        count: 0,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
