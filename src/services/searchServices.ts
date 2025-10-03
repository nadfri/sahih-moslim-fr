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
  matn_en: string;
  chapter: {
    id: string;
    name_fr: string;
    name_ar: string | null;
    name_en: string | null;
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
    // Fallback for test environments without unaccent extension
    const results = await prisma.$queryRaw<SearchResult[]>`
      SELECT 
        h.id,
        h.numero,
        h.matn_fr,
        h.matn_ar,
        h.matn_en,
        json_build_object(
          'id', c.id,
          'name_fr', c.name_fr,
          'name_ar', c.name_ar,
          'name_en', c.name_en,
          'slug', c.slug,
          'index', c.index
        ) as chapter
      FROM "Hadith" h
      INNER JOIN "Chapter" c ON h."chapterId" = c.id
      WHERE 
        -- Unified search: case-insensitive search
        lower(h.matn_fr) LIKE '%' || lower(${query}) || '%'
        OR lower(h.matn_ar) LIKE '%' || lower(${query}) || '%'
        OR lower(h.matn_en) LIKE '%' || lower(${query}) || '%'
        OR lower(h.matn_ar) LIKE '%' || lower(${normalizedQuery}) || '%'
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
            name_fr: {
              in: sahabaNames,
            },
          },
        },
      },
      include: {
        chapter: {
          select: {
            id: true,
            index: true,
            slug: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        mentionedSahabas: {
          select: {
            id: true,
            slug: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        hadithTransmitters: {
          include: {
            transmitter: {
              select: {
                id: true,
                slug: true,
                name_fr: true,
                name_ar: true,
                name_en: true,
                createdAt: true,
                updatedAt: true,
              },
            },
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
      const hadithSahabaNames = hadith.mentionedSahabas.map(
        (s: { name_fr: string }) => s.name_fr
      );
      return sahabaNames.every((sahaba) => hadithSahabaNames.includes(sahaba));
    });

    // Transform to match HadithType
    return filteredHadiths.map((hadith) => ({
      id: hadith.id ?? "",
      numero: hadith.numero ?? 0,
      matn_fr: hadith.matn_fr ?? "",
      matn_ar: hadith.matn_ar ?? "",
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
          id: s.id ?? "",
          slug: s.slug ?? "",
          name_fr: s.name_fr ?? "",
          name_ar: s.name_ar ?? "",
          name_en: s.name_en ?? "",
          createdAt: s.createdAt ?? new Date(),
          updatedAt: s.updatedAt ?? new Date(),
        })) ?? [],
      isnadTransmitters:
        hadith.hadithTransmitters?.map((ht) => ({
          id: ht.transmitter?.id ?? "",
          slug: ht.transmitter?.slug ?? "",
          name_fr: ht.transmitter?.name_fr ?? "",
          name_ar: ht.transmitter?.name_ar ?? "",
          name_en: ht.transmitter?.name_en ?? "",
          createdAt: ht.transmitter?.createdAt ?? new Date(),
          updatedAt: ht.transmitter?.updatedAt ?? new Date(),
        })) ?? [],
      createdAt: hadith.createdAt ?? new Date(),
      updatedAt: hadith.updatedAt ?? new Date(),
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
              name_fr: {
                in: transmitterNames,
              },
            },
          },
        },
      },
      include: {
        chapter: {
          select: {
            id: true,
            index: true,
            slug: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        mentionedSahabas: {
          select: {
            id: true,
            slug: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        hadithTransmitters: {
          include: {
            transmitter: {
              select: {
                id: true,
                slug: true,
                name_fr: true,
                name_ar: true,
                name_en: true,
                createdAt: true,
                updatedAt: true,
              },
            },
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
        (ht: { transmitter: { name_fr: string } }) => ht.transmitter.name_fr
      );
      return transmitterNames.every((transmitter) =>
        hadithTransmitterNames.includes(transmitter)
      );
    });

    // Transform to match HadithType
    return filteredHadiths.map((hadith) => ({
      id: hadith.id ?? "",
      numero: hadith.numero ?? 0,
      matn_fr: hadith.matn_fr ?? "",
      matn_ar: hadith.matn_ar ?? "",
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
          id: s.id ?? "",
          slug: s.slug ?? "",
          name_fr: s.name_fr ?? "",
          name_ar: s.name_ar ?? "",
          name_en: s.name_en ?? "",
          createdAt: s.createdAt ?? new Date(),
          updatedAt: s.updatedAt ?? new Date(),
        })) ?? [],
      isnadTransmitters:
        hadith.hadithTransmitters?.map((ht) => ({
          id: ht.transmitter?.id ?? "",
          slug: ht.transmitter?.slug ?? "",
          name_fr: ht.transmitter?.name_fr ?? "",
          name_ar: ht.transmitter?.name_ar ?? "",
          name_en: ht.transmitter?.name_en ?? "",
          createdAt: ht.transmitter?.createdAt ?? new Date(),
          updatedAt: ht.transmitter?.updatedAt ?? new Date(),
        })) ?? [],
      createdAt: hadith.createdAt ?? new Date(),
      updatedAt: hadith.updatedAt ?? new Date(),
    }));
  } catch (error) {
    console.error("Error in searchHadithsByTransmitters:", error);
    return [];
  }
}
