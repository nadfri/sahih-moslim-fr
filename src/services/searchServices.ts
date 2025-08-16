/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { prisma } from "@/prisma/prisma";
import { HadithType } from "@/src/types/types";

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

// Combined search in both French and Arabic content
export async function searchHadithsCombined(
  query: string,
  filterMode: "text" | "word" = "text",
  limit = 50
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    // For word-based search, always use ILIKE to match exact words without stemming
    if (filterMode === "word") {
      const results = await prisma.$queryRaw<SearchResult[]>`
        SELECT 
          h.id,
          h.numero,
          h.matn_fr,
          h.matn_ar,
          1.0 as rank,
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
          unaccent(h.matn_fr) ILIKE unaccent(${"%" + query + "%"})
          OR unaccent(h.matn_ar) ILIKE unaccent(${"%" + query + "%"})
          OR unaccent(n.name) ILIKE unaccent(${"%" + query + "%"})
        ORDER BY h.numero ASC
        LIMIT ${limit}
      `;
      return results;
    }

    // For very short queries (3 characters or less), use ILIKE for better results
    if (query.trim().length <= 3) {
      const results = await prisma.$queryRaw<SearchResult[]>`
        SELECT 
          h.id,
          h.numero,
          h.matn_fr,
          h.matn_ar,
          1.0 as rank,
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
          h.matn_fr ILIKE ${"%" + query + "%"}
          OR h.matn_ar ILIKE ${"%" + query + "%"}
        ORDER BY h.numero ASC
        LIMIT ${limit}
      `;
      return results;
    }

    // For longer queries, use full-text search
    const results = await prisma.$queryRaw<SearchResult[]>`
      SELECT 
        h.id,
        h.numero,
        h.matn_fr,
        h.matn_ar,
        GREATEST(
          ts_rank(to_tsvector('french', h.matn_fr), plainto_tsquery('french', ${query})),
          ts_rank(to_tsvector('arabic', h.matn_ar), plainto_tsquery('arabic', ${query}))
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
        to_tsvector('french', h.matn_fr) @@ plainto_tsquery('french', ${query})
        OR to_tsvector('arabic', h.matn_ar) @@ plainto_tsquery('arabic', ${query})
      ORDER BY rank DESC, h.numero ASC
      LIMIT ${limit}
    `;

    return results;
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
