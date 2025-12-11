/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { NextRequest, NextResponse } from "next/server";

import {
  searchHadithsBySahabas,
  searchHadithsByTransmitters,
  searchHadithsCombined,
} from "@/src/services/searchServices";
import { getHadithByNumero } from "@/src/services/services";
import { HadithType } from "@/src/types/types";
import { detectFilterMode, extractSearchParams } from "@/src/utils/searchUtils";
import prisma from "@/prisma/prisma";

// API result type (simplified)
type ApiSearchResult = HadithType;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract and standardize search parameters
    const params = extractSearchParams(searchParams);
    const { query, sahabas, transmitters, numero } = params;

    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Extract locale from query params or headers, fallback to "fr"
    const locale =
      searchParams.get("locale") ||
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "fr";

    // Auto-detect filterMode based on present parameters
    const filterMode = detectFilterMode(params);

    let results: ApiSearchResult[] = [];

    switch (filterMode) {
      case "word":
        if (query.length >= 3) {
          // Use optimized PostgreSQL Full-Text Search with GIN indexes
          const searchResults = await searchHadithsCombined(
            query,
            locale,
            limit
          );

          // Fetch complete hadith data including relations for each result
          const hadithIds = searchResults.map((r) => r.id);

          // Build locale-aware selects to avoid fetching unnecessary fields
          const chapterSelect = {
            id: true,
            index: true,
            slug: true,
            name_fr: true,
            ...(locale === "ar" ? { name_ar: true } : {}),
            ...(locale === "en" ? { name_en: true } : {}),
          } as const;

          const itemSelect = {
            id: true,
            slug: true,
            name_fr: true,
            ...(locale === "ar" ? { name_ar: true } : {}),
            ...(locale === "en" ? { name_en: true } : {}),
          } as const;

          const hadithSelect = {
            id: true,
            numero: true,
            // Always include AR matn; include FR/EN based on locale
            ...(locale !== "ar" ? { matn_fr: true } : {}),
            ...(locale === "en" ? { matn_en: true } : {}),
            matn_ar: true,
            chapter: { select: chapterSelect },
            mentionedSahabas: { select: itemSelect },
            hadithTransmitters: {
              orderBy: { order: "asc" as const },
              select: {
                transmitter: { select: itemSelect },
              },
            },
          } as const;

          const completeHadiths = await prisma.hadith.findMany({
            where: {
              id: {
                in: hadithIds,
              },
            },
            select: hadithSelect,
          });

          // Map to preserve search order and transform hadithTransmitters to isnadTransmitters
          type SelectedItem = {
            id: string;
            slug: string;
            name_fr: string;
            name_ar?: string | null;
            name_en?: string | null;
          };
          type SelectedHadith = {
            id: string;
            numero: number;
            matn_fr?: string;
            matn_ar?: string;
            matn_en?: string;
            chapter: {
              id: string;
              index: number;
              slug: string;
              name_fr: string;
              name_ar?: string | null;
              name_en?: string | null;
            };
            mentionedSahabas: SelectedItem[];
            hadithTransmitters: { transmitter: SelectedItem }[];
            createdAt: Date;
            updatedAt: Date;
          };

          const hadiths = completeHadiths as unknown as SelectedHadith[];
          const hadithMap = new Map(hadiths.map((h) => [h.id, h] as const));
          const mappedResults = searchResults
            .map((searchResult) => {
              const hadith = hadithMap.get(searchResult.id);
              if (!hadith) return null;

              return {
                id: hadith.id,
                numero: hadith.numero,
                // Provide safe fallbacks for optional texts not selected for this locale
                matn_fr: hadith.matn_fr ?? "",
                matn_ar: hadith.matn_ar ?? "",
                matn_en: hadith.matn_en ?? "",
                chapter: {
                  id: hadith.chapter?.id ?? "",
                  name_fr: hadith.chapter?.name_fr ?? "",
                  name_ar: hadith.chapter?.name_ar ?? "",
                  name_en: hadith.chapter?.name_en ?? "",
                  slug: hadith.chapter?.slug ?? "",
                  index: hadith.chapter?.index ?? 0,
                },
                mentionedSahabas:
                  hadith.mentionedSahabas?.map((s) => ({
                    id: s.id,
                    slug: s.slug,
                    name_fr: s.name_fr,
                    name_ar: s.name_ar ?? "",
                    name_en: s.name_en ?? "",
                  })) ?? [],
                isnadTransmitters:
                  hadith.hadithTransmitters?.map((ht) => ({
                    id: ht.transmitter?.id ?? "",
                    slug: ht.transmitter?.slug ?? "",
                    name_fr: ht.transmitter?.name_fr ?? "",
                    name_ar: ht.transmitter?.name_ar ?? "",
                    name_en: ht.transmitter?.name_en ?? "",
                  })) ?? [],
              } as ApiSearchResult;
            })
            .filter((h) => h !== null);
          results = mappedResults as ApiSearchResult[];
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
