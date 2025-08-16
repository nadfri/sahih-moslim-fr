/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { prisma } from "@/prisma/prisma";
import { HadithType } from "@/src/types/types";
import { prepareArabicForSearch } from "@/src/utils/normalizeArabicText";

/**
 * PostgreSQL Full-Text Search Services
 * Optimized for Supabase with GIN indexes
 */

export type SearchResult = {
  id: string;
  numero: number;
  matn_fr: string;
  matn_ar: string;
  rank: number;
  chapter: {
    id: string;
    name: string;
    slug: string;
    index: number;
  };
  narrator: {
    id: string;
    name: string;
    slug: string;
  };
};

// Search only in Hadith content (French and Arabic text)
export async function searchHadithsCombined(
  query: string,
  limit = 50
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  // Normalize Arabic text for better search matching
  const normalizedQuery = prepareArabicForSearch(query);

  try {
    // Check if query contains only ASCII characters for ts_query
    const isAsciiOnly = /^[a-zA-Z\s]+$/.test(normalizedQuery);

    if (isAsciiOnly) {
      // Use full-text search for ASCII (French) text
      const results = await prisma.$queryRaw<SearchResult[]>`
        SELECT 
          h.id,
          h.numero,
          h.matn_fr,
          h.matn_ar,
          GREATEST(
            ts_rank(to_tsvector('french', h.matn_fr), to_tsquery('french', ${normalizedQuery + ":*"})),
            CASE WHEN LOWER(h.matn_fr) LIKE LOWER(${"%" + normalizedQuery + "%"}) THEN 0.5 ELSE 0 END
          ) as rank,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'index', c.index
          ) as chapter,
          json_build_object(
            'id', n.id,
            'name', n.name,
            'slug', n.slug
          ) as narrator
        FROM "Hadith" h
        JOIN "Chapter" c ON h."chapterId" = c.id
        JOIN "Narrator" n ON h."narratorId" = n.id
        WHERE 
          to_tsvector('french', h.matn_fr) @@ to_tsquery('french', ${normalizedQuery + ":*"})
          OR LOWER(h.matn_fr) LIKE LOWER(${"%" + normalizedQuery + "%"})
        ORDER BY rank DESC
        LIMIT ${limit}
      `;
      return results;
    } else {
      // Use LIKE search for non-ASCII (Arabic) text
      const results = await prisma.$queryRaw<SearchResult[]>`
        SELECT 
          h.id,
          h.numero,
          h.matn_fr,
          h.matn_ar,
          GREATEST(
            CASE WHEN LOWER(h.matn_fr) LIKE LOWER(${"%" + normalizedQuery + "%"}) THEN 0.5 ELSE 0 END,
            CASE WHEN REGEXP_REPLACE(h.matn_ar, '[ًٌٍَُِّْٰ]', '', 'g') LIKE ${"%" + normalizedQuery + "%"} THEN 0.8 ELSE 0 END
          ) as rank,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'index', c.index
          ) as chapter,
          json_build_object(
            'id', n.id,
            'name', n.name,
            'slug', n.slug
          ) as narrator
        FROM "Hadith" h
        JOIN "Chapter" c ON h."chapterId" = c.id
        JOIN "Narrator" n ON h."narratorId" = n.id
        WHERE 
          LOWER(h.matn_fr) LIKE LOWER(${"%" + normalizedQuery + "%"})
          OR REGEXP_REPLACE(h.matn_ar, '[ًٌٍَُِّْٰ]', '', 'g') LIKE ${"%" + normalizedQuery + "%"}
        ORDER BY rank DESC
        LIMIT ${limit}
      `;
      return results;
    }
  } catch (error) {
    console.error("Error in searchHadithsCombined:", error);
    return [];
  }
}

// Optimized search by narrator with pagination
export async function searchHadithsByNarrator(
  narratorName: string,
  offset = 0,
  limit = 20
): Promise<HadithType[]> {
  try {
    const hadiths = await prisma.hadith.findMany({
      where: {
        narrator: {
          name: narratorName,
        },
      },
      include: {
        chapter: true,
        narrator: true,
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

    // Transform to match HadithType
    return hadiths.map((hadith) => ({
      ...hadith,
      isnadTransmitters: hadith.hadithTransmitters.map((ht) => ht.transmitter),
    }));
  } catch (error) {
    console.error("Error in searchHadithsByNarrator:", error);
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
        narrator: true,
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
        narrator: true,
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
