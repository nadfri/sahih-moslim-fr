import { z } from "zod";

import { prisma } from "@/prisma/prisma";
import { HadithSchema, HadithType, ItemType } from "../types/types";

// Get all hadith numbers
export async function getHadithNumeros(): Promise<number[]> {
  const hadiths = await prisma.hadith.findMany({
    select: { numero: true },
    orderBy: { numero: "asc" },
  });

  return hadiths.map((hadith) => hadith.numero);
}

// Get all hadiths, parsed with zod
export async function getAllHadiths(): Promise<HadithType[]> {
  const hadiths = await prisma.hadith.findMany({
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
  });

  // Transform the data to match HadithType structure
  const transformedHadiths = hadiths.map((hadith) => ({
    ...hadith,
    isnadTransmitters: (hadith.hadithTransmitters ?? []).map(
      (ht: { transmitter: ItemType }) => ht.transmitter
    ),
  }));

  // Parse to remove unwanted fields and ensure types
  return z.array(HadithSchema).parse(transformedHadiths);
}

// Get a single hadith by numero, parsed with zod
export async function getHadithByNumero(
  numero: string
): Promise<HadithType | null> {
  const hadith = await prisma.hadith.findUnique({
    where: { numero: parseInt(numero) },
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
  });

  if (!hadith) return null;

  // Transform the data to match HadithType structure
  const transformedHadith = {
    ...hadith,
    isnadTransmitters: (hadith.hadithTransmitters ?? []).map(
      (ht: { transmitter: ItemType }) => ht.transmitter
    ),
  };

  return HadithSchema.parse(transformedHadith);
}

// Get all chapters with hadith count and index
export async function getAllChapters(): Promise<ItemType[]> {
  const chapters = await prisma.chapter.findMany({
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      slug: true,
      index: true,
      _count: { select: { hadiths: true } },
    },
    orderBy: { index: "asc" },
  });
  // Map to ItemType with hadithCount
  return chapters.map((chapter) => ({
    id: chapter.id,
    name_fr: chapter.name_fr,
    name_ar: chapter.name_ar ?? "",
    name_en: chapter.name_en ?? "",
    slug: chapter.slug,
    index: chapter.index,
    hadithCount: chapter._count.hadiths,
  }));
}

// Get a single chapter by slug with hadith count and index
export async function getChapterBySlug(slug: string): Promise<ItemType | null> {
  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      slug: true,
      index: true,
      _count: { select: { hadiths: true } },
    },
  });
  // Return mapped chapter or null
  return chapter
    ? {
        id: chapter.id,
        name_fr: chapter.name_fr,
        name_ar: chapter.name_ar ?? "",
        name_en: chapter.name_en ?? "",
        slug: chapter.slug,
        index: chapter.index,
        hadithCount: chapter._count.hadiths,
      }
    : null;
}

// Get a chapter and its hadiths (chapter now includes index)
export async function getChapterWithHadiths(slug: string): Promise<{
  chapter: ItemType | null;
  hadiths: HadithType[];
}> {
  const chapter = await getChapterBySlug(slug);

  if (!chapter) return { chapter: null, hadiths: [] };
  const hadiths = await prisma.hadith.findMany({
    where: { chapter: { id: chapter.id } },
    include: {
      chapter: {
        select: {
          id: true,
          name_fr: true,
          name_ar: true,
          name_en: true,
          slug: true,
          index: true,
        },
      },
      mentionedSahabas: {
        select: {
          id: true,
          name_fr: true,
          name_ar: true,
          name_en: true,
          slug: true,
        },
      },
      hadithTransmitters: {
        include: {
          transmitter: {
            select: {
              id: true,
              name_fr: true,
              name_ar: true,
              name_en: true,
              slug: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: { numero: "asc" },
  });

  // Transform the data to match HadithType structure
  const transformedHadiths = hadiths.map((hadith) => ({
    ...hadith,
    isnadTransmitters: (hadith.hadithTransmitters ?? []).map(
      (ht: { transmitter: ItemType }) => ht.transmitter
    ),
  }));

  // Parse hadiths
  const hadithsParsed = z.array(HadithSchema).parse(transformedHadiths);
  return { chapter, hadiths: hadithsParsed };
}

// Get all sahabas with hadith count
export async function getAllSahabas(): Promise<ItemType[]> {
  const sahabas = await prisma.sahaba.findMany({
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      slug: true,
      _count: { select: { mentionedInHadiths: true } },
    },
    orderBy: { name_fr: "asc" },
  });
  // Map to ItemType with hadithCount
  return sahabas.map((sahaba) => ({
    id: sahaba.id,
    name_fr: sahaba.name_fr,
    name_ar: sahaba.name_ar ?? "",
    name_en: sahaba.name_en ?? "",
    slug: sahaba.slug,
    hadithCount: sahaba._count.mentionedInHadiths,
  }));
}

// Get a single sahaba by slug
export async function getSahabaBySlug(slug: string): Promise<ItemType | null> {
  const sahaba = await prisma.sahaba.findUnique({
    where: { slug },
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      slug: true,
      _count: { select: { mentionedInHadiths: true } },
    },
  });
  // Return mapped sahaba or null
  return sahaba
    ? {
        id: sahaba.id,
        name_fr: sahaba.name_fr,
        name_ar: sahaba.name_ar ?? "",
        name_en: sahaba.name_en ?? "",
        slug: sahaba.slug,
        hadithCount: sahaba._count.mentionedInHadiths,
      }
    : null;
}

// Get a sahaba and their hadiths
export async function getSahabaWithHadiths(slug: string): Promise<{
  sahaba: ItemType | null;
  hadiths: HadithType[];
}> {
  // Fetch sahaba
  const sahaba = await getSahabaBySlug(slug);

  if (!sahaba) return { sahaba: null, hadiths: [] };
  const hadiths = await prisma.hadith.findMany({
    where: { mentionedSahabas: { some: { slug: sahaba.slug } } },
    include: {
      chapter: {
        select: {
          id: true,
          name_fr: true,
          name_ar: true,
          name_en: true,
          slug: true,
          index: true,
        },
      },
      mentionedSahabas: {
        select: {
          id: true,
          name_fr: true,
          name_ar: true,
          name_en: true,
          slug: true,
        },
      },
      hadithTransmitters: {
        include: {
          transmitter: {
            select: {
              id: true,
              name_fr: true,
              name_ar: true,
              name_en: true,
              slug: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: { numero: "asc" },
  });

  // Transform the data to match HadithType structure
  const transformedHadiths = hadiths.map((hadith) => ({
    ...hadith,
    isnadTransmitters:
      hadith.hadithTransmitters?.map((ht) => ht.transmitter) ?? [],
  }));

  // Parse hadiths
  const hadithsParsed = z.array(HadithSchema).parse(transformedHadiths);
  return { sahaba, hadiths: hadithsParsed };
}

// Get all sahaba names
export async function getSahabaNames(): Promise<string[]> {
  const sahabas = await prisma.sahaba.findMany({
    select: { name_fr: true },
    orderBy: { name_fr: "asc" },
  });
  // Map to array of names
  return sahabas.map((sahaba) => sahaba.name_fr);
}

// Get all transmitters with hadith count
export async function getAllTransmitters(): Promise<ItemType[]> {
  const transmitters = await prisma.transmitter.findMany({
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      slug: true,
      _count: { select: { hadithTransmitters: true } },
    },
    orderBy: { name_fr: "asc" },
  });
  // Map to ItemType with hadithCount
  return transmitters.map((transmitter) => ({
    id: transmitter.id,
    name_fr: transmitter.name_fr,
    name_ar: transmitter.name_ar ?? "",
    name_en: transmitter.name_en ?? "",
    slug: transmitter.slug,
    hadithCount: transmitter._count.hadithTransmitters,
  }));
}

// Get a single transmitter by slug
export async function getTransmitterBySlug(
  slug: string
): Promise<ItemType | null> {
  const transmitter = await prisma.transmitter.findUnique({
    where: { slug },
    select: {
      id: true,
      name_fr: true,
      name_ar: true,
      name_en: true,
      slug: true,
      _count: { select: { hadithTransmitters: true } },
    },
  });
  // Return mapped transmitter or null
  return transmitter
    ? {
        id: transmitter.id,
        name_fr: transmitter.name_fr,
        name_ar: transmitter.name_ar ?? "",
        name_en: transmitter.name_en ?? "",
        slug: transmitter.slug,
        hadithCount: transmitter._count.hadithTransmitters,
      }
    : null;
}

// Get a transmitter and their hadiths
export async function getTransmitterWithHadiths(slug: string): Promise<{
  transmitter: ItemType | null;
  hadiths: HadithType[];
}> {
  // Fetch transmitter
  const transmitter = await getTransmitterBySlug(slug);
  if (!transmitter) return { transmitter: null, hadiths: [] };

  const hadiths = await prisma.hadith.findMany({
    where: {
      hadithTransmitters: {
        some: {
          transmitter: {
            slug: transmitter.slug,
          },
        },
      },
    },
    include: {
      chapter: {
        select: {
          id: true,
          name_fr: true,
          name_ar: true,
          name_en: true,
          slug: true,
          index: true,
        },
      },
      mentionedSahabas: {
        select: {
          id: true,
          name_fr: true,
          name_ar: true,
          name_en: true,
          slug: true,
        },
      },
      hadithTransmitters: {
        include: {
          transmitter: {
            select: {
              id: true,
              name_fr: true,
              name_ar: true,
              name_en: true,
              slug: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: { numero: "asc" },
  });

  // Transform the data to match HadithType structure
  const transformedHadiths = hadiths.map((hadith) => ({
    ...hadith,
    isnadTransmitters:
      hadith.hadithTransmitters?.map((ht) => ht.transmitter) ?? [],
  }));

  // Parse hadiths
  const hadithsParsed = z.array(HadithSchema).parse(transformedHadiths);
  return { transmitter, hadiths: hadithsParsed };
}

// Get all transmitter names
export async function getTransmitterNames(): Promise<string[]> {
  const transmitters = await prisma.transmitter.findMany({
    select: { name_fr: true },
  });
  // Map to array of names
  return transmitters.map((transmitter) => transmitter.name_fr);
}
