/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { NextRequest, NextResponse } from "next/server";

import {
  searchHadithsByNarrator,
  searchHadithsBySahabas,
  searchHadithsByTransmitters,
  searchHadithsCombined,
} from "@/src/services/searchServices";
import { getHadithByNumero } from "@/src/services/services";
import { HadithType } from "@/src/types/types";
import { detectFilterMode, extractSearchParams } from "@/src/utils/searchUtils";

// API result type (simplified)
type ApiSearchResult = HadithType;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract and standardize search parameters
    const params = extractSearchParams(searchParams);
    const { query, narrator, sahabas, transmitters, numero } = params;

    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "25");

    // Auto-detect filterMode based on present parameters
    const filterMode = detectFilterMode(params);

    let results: ApiSearchResult[] = [];

    switch (filterMode) {
      case "word":
        if (query.length >= 3) {
          // Use optimized PostgreSQL Full-Text Search with GIN indexes
          const searchResults = await searchHadithsCombined(query, limit);

          // Minimal transformation from SearchResult to HadithType format
          results = searchResults.map((result) => ({
            ...result,
            chapterId: result.chapter.id,
            narratorId: result.narrator.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mentionedSahabas: [],
            isnadTransmitters: [],
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
