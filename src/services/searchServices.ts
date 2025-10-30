/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { prisma } from "@/prisma/prisma";
import { HadithType } from "@/src/types/types";
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

// Search only in Hadith content based on locale preferences
// Optimized for <300ms performance: caching + smaller result sets + efficient queries
export async function searchHadithsCombined(
  query: string,
  locale: string = "fr", // Default to French
  limit = 50 // Reduced default limit for better performance
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  // Get cached results with locale support
  const cachedResults = searchCache.get(query, locale, limit);
  if (cachedResults) {
    return cachedResults;
  }

  try {
    let sql: string;

    // Optimize search based on locale - select only necessary columns
    // FR: search in French and Arabic only, get FR+AR content
    // EN: search in English and Arabic only, get EN+AR content
    // AR: search in Arabic only, get AR content only
    if (locale === "ar") {
      sql = `
        SELECT 
          h.id, h.numero, h.matn_ar,
          '' as matn_fr, '' as matn_en,
          c.id as chapter_id, c.name_ar as chapter_name_ar, c.name_fr as chapter_name_fr, c.name_en as chapter_name_en, 
          c.slug as chapter_slug, c.index as chapter_index
        FROM "Hadith" h
        JOIN "Chapter" c ON h."chapterId" = c.id
        WHERE h.matn_ar ILIKE '%' || $1 || '%'
        ORDER BY h.numero ASC
        LIMIT $2
      `;
    } else if (locale === "en") {
      sql = `
        SELECT 
          h.id, h.numero, h.matn_ar, h.matn_en,
          '' as matn_fr,
          c.id as chapter_id, c.name_ar as chapter_name_ar, c.name_en as chapter_name_en, c.name_fr as chapter_name_fr,
          c.slug as chapter_slug, c.index as chapter_index
        FROM "Hadith" h
        JOIN "Chapter" c ON h."chapterId" = c.id
        WHERE (
          h.matn_ar ILIKE '%' || $1 || '%'
          OR h.matn_en ILIKE '%' || $1 || '%'
        )
        ORDER BY h.numero ASC
        LIMIT $2
      `;
    } else {
      // Default for FR locale - using ILIKE for case-insensitive substring search
      sql = `
        SELECT 
          h.id, h.numero, h.matn_ar, h.matn_fr,
          '' as matn_en,
          c.id as chapter_id, c.name_ar as chapter_name_ar, c.name_fr as chapter_name_fr, c.name_en as chapter_name_en,
          c.slug as chapter_slug, c.index as chapter_index
        FROM "Hadith" h
        JOIN "Chapter" c ON h."chapterId" = c.id
        WHERE (
          h.matn_ar ILIKE '%' || $1 || '%'
          OR h.matn_fr ILIKE '%' || $1 || '%'
        )
        ORDER BY h.numero ASC
        LIMIT $2
      `;
    }

    type HadithWithChapter = {
      id: string;
      numero: number;
      matn_fr: string;
      matn_ar: string;
      matn_en: string;
      chapter_id: string;
      chapter_name_fr: string;
      chapter_name_ar: string | null;
      chapter_name_en: string | null;
      chapter_slug: string;
      chapter_index: number;
    };
    const hadiths = await prisma.$queryRawUnsafe<HadithWithChapter[]>(
      sql,
      query,
      limit
    );

    const results: SearchResult[] = hadiths.map((hadith) => ({
      id: hadith.id,
      numero: hadith.numero,
      matn_fr: hadith.matn_fr,
      matn_ar: hadith.matn_ar,
      matn_en: hadith.matn_en || "",
      chapter: {
        id: hadith.chapter_id,
        name_fr: hadith.chapter_name_fr,
        name_ar: hadith.chapter_name_ar,
        name_en: hadith.chapter_name_en,
        slug: hadith.chapter_slug,
        index: hadith.chapter_index || 0,
      },
    }));

    // Cache the results for faster subsequent queries with locale-specific key
    searchCache.set(query, locale, limit, results);
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
          },
        },
        mentionedSahabas: {
          select: {
            id: true,
            slug: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
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
        })) ?? [],
      isnadTransmitters:
        hadith.hadithTransmitters?.map((ht) => ({
          id: ht.transmitter?.id ?? "",
          slug: ht.transmitter?.slug ?? "",
          name_fr: ht.transmitter?.name_fr ?? "",
          name_ar: ht.transmitter?.name_ar ?? "",
          name_en: ht.transmitter?.name_en ?? "",
        })) ?? [],
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
          },
        },
        mentionedSahabas: {
          select: {
            id: true,
            slug: true,
            name_fr: true,
            name_ar: true,
            name_en: true,
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
        })) ?? [],
      isnadTransmitters:
        hadith.hadithTransmitters?.map((ht) => ({
          id: ht.transmitter?.id ?? "",
          slug: ht.transmitter?.slug ?? "",
          name_fr: ht.transmitter?.name_fr ?? "",
          name_ar: ht.transmitter?.name_ar ?? "",
          name_en: ht.transmitter?.name_en ?? "",
        })) ?? [],
    }));
  } catch (error) {
    console.error("Error in searchHadithsByTransmitters:", error);
    return [];
  }
}
