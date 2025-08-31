/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { prisma } from "@/prisma/prisma";
import { HadithType } from "@/src/types/types";
import { prepareArabicForSearch } from "@/src/utils/normalizeArabicText";
import { searchCache } from "./searchCache";

/**
 * PostgreSQL Full-Text Search Services
 * Optimized for Supabase with GIN indexes and in-memory caching
 */

export type SearchResult = {
  id: string;
  numero: number;
  matn_fr: string;
  matn_ar: string;
  chapter: {
    id: string;
    name: string;
    slug: string;
    index: number;
  };
};

// Search only in Hadith content (French and Arabic text)
// Optimized for <300ms performance: caching + smaller result sets + efficient queries
export async function searchHadithsCombined(
  query: string,
  limit = 25 // Reduced default limit for better performance
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  // Check cache first for instant results
  const cachedResults = searchCache.get(query, limit);
  if (cachedResults) {
    return cachedResults;
  }

  // Normalize the query for better matching
  const normalizedQuery = prepareArabicForSearch(query);

  try {
    // Simplified single SQL query - let PostgreSQL handle optimization
    const results = await prisma.$queryRaw<SearchResult[]>`
      SELECT 
        h.id,
        h.numero,
        h.matn_fr,
        h.matn_ar,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'index', c.index
        ) as chapter,
      FROM "Hadith" h
      INNER JOIN "Chapter" c ON h."chapterId" = c.id
      WHERE 
        -- Unified search: trigram + accent-insensitive in single query
        lower(h.matn_fr) LIKE '%' || lower(${query}) || '%'
        OR lower(h.matn_ar) LIKE '%' || lower(${query}) || '%'
        OR lower(h.matn_ar) LIKE '%' || lower(${normalizedQuery}) || '%'
        OR unaccent(lower(h.matn_fr)) LIKE '%' || unaccent(lower(${query})) || '%'
      ORDER BY h.numero ASC
      LIMIT ${limit}
    `;

    // Cache the results for faster subsequent queries
    searchCache.set(query, limit, results);

    return results;
  } catch (error) {
    console.error("Error in searchHadithsCombined:", error);
    return [];
  }
}

// Optimized search by sahabas with pagination
export async function searchHadithsBySahabas(
  sahabaNames: string[],
  offset = 0,
  limit = 20
): Promise<HadithType[]> {
  if (sahabaNames.length === 0) return [];

  try {
    const hadiths = await prisma.hadith.findMany({
      where: {
        mentionedSahabas: {
          some: {
            name: {
              in: sahabaNames,
            },
          },
        },
      },
      include: {
        chapter: true,
        mentionedSahabas: true,
        hadithTransmitters: {
          include: {
            transmitter: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: { numero: "asc" },
      skip: offset,
      take: limit,
    });

    // Filter to ensure ALL sahabas are mentioned (if required)
    const filteredHadiths = hadiths.filter((hadith) => {
      const hadithSahabaNames = hadith.mentionedSahabas.map((s) => s.name);
      return sahabaNames.every((sahaba) => hadithSahabaNames.includes(sahaba));
    });

    // Transform to match HadithType
    return filteredHadiths.map((hadith) => ({
      ...hadith,
      isnadTransmitters: hadith.hadithTransmitters.map((ht) => ht.transmitter),
    }));
  } catch (error) {
    console.error("Error in searchHadithsBySahabas:", error);
    return [];
  }
}

// Optimized search by transmitters with pagination
export async function searchHadithsByTransmitters(
  transmitterNames: string[],
  offset = 0,
  limit = 20
): Promise<HadithType[]> {
  if (transmitterNames.length === 0) return [];

  try {
    const hadiths = await prisma.hadith.findMany({
      where: {
        hadithTransmitters: {
          some: {
            transmitter: {
              name: {
                in: transmitterNames,
              },
            },
          },
        },
      },
      include: {
        chapter: true,
        mentionedSahabas: true,
        hadithTransmitters: {
          include: {
            transmitter: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: { numero: "asc" },
      skip: offset,
      take: limit,
    });

    // Filter to ensure ALL transmitters are in the chain (if required)
    const filteredHadiths = hadiths.filter((hadith) => {
      const hadithTransmitterNames = hadith.hadithTransmitters.map(
        (ht) => ht.transmitter.name
      );
      return transmitterNames.every((transmitter) =>
        hadithTransmitterNames.includes(transmitter)
      );
    });

    // Transform to match HadithType
    return filteredHadiths.map((hadith) => ({
      ...hadith,
      isnadTransmitters: hadith.hadithTransmitters.map((ht) => ht.transmitter),
    }));
  } catch (error) {
    console.error("Error in searchHadithsByTransmitters:", error);
    return [];
  }
}
