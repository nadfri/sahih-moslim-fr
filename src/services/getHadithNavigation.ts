import { getHadithNumeros } from "./services";

// Cache for sorted hadith numbers to avoid repeated database calls and sorting
let cachedSortedNumeros: number[] | null = null;

/**
 * Get sorted hadith numbers (cached)
 */
async function getSortedNumeros(): Promise<number[]> {
  if (!cachedSortedNumeros) {
    const numeros = await getHadithNumeros();
    cachedSortedNumeros = numeros.sort((a, b) => a - b);
  }
  return cachedSortedNumeros;
}

/**
 * Get the previous and next hadith numbers for navigation
 * More efficient: uses simple logic instead of database queries
 */
export async function getHadithNavigation(currentNumero: number) {
  try {
    const sortedNumeros = await getSortedNumeros();

    const currentIndex = sortedNumeros.indexOf(currentNumero);

    if (currentIndex === -1) {
      // Current hadith not found
      return {
        previousNumero: undefined,
        nextNumero: undefined,
      };
    }

    return {
      previousNumero:
        currentIndex > 0 ? sortedNumeros[currentIndex - 1] : undefined,
      nextNumero:
        currentIndex < sortedNumeros.length - 1
          ? sortedNumeros[currentIndex + 1]
          : undefined,
    };
  } catch (error) {
    console.error("Error fetching hadith navigation:", error);
    return {
      previousNumero: undefined,
      nextNumero: undefined,
    };
  }
}
