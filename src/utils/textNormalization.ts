/**
 * Comprehensive text normalization utilities for multilingual search
 * Handles French accents, Arabic diacritics, and other special characters
 */

/**
 * Normalizes French text by removing accents and special characters
 * Example: "café naïve" becomes "cafe naive"
 */
export function normalizeFrenchText(text: string): string {
  if (!text) return "";

  return text
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/[œ]/g, "oe") // Replace œ with oe
    .replace(/[Œ]/g, "OE") // Replace Œ with OE
    .replace(/[æ]/g, "ae") // Replace æ with ae
    .replace(/[Æ]/g, "AE") // Replace Æ with AE
    .replace(/[ç]/g, "c") // Replace ç with c
    .replace(/[Ç]/g, "C") // Replace Ç with C
    .toLowerCase()
    .trim();
}

/**
 * Normalizes Arabic text by removing diacritics (tashkil)
 * This allows matching between text with and without diacritics
 * Example: عَمْرٌ becomes عمر
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";

  // Remove Arabic diacritics (tashkil/harakat)
  // Unicode ranges for Arabic diacritics: U+064B to U+065F, U+0670, U+06D6 to U+06ED
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // Remove diacritics
    .replace(/[\u200B-\u200F\uFEFF]/g, "") // Remove zero-width characters
    .replace(/\u0640/g, "") // Remove Tatweel (ـ)
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Normalizes English text by removing special characters and normalizing case
 * Example: "It's a "test"" becomes "its a test"
 */
export function normalizeEnglishText(text: string): string {
  if (!text) return "";

  return text
    .normalize("NFD") // Decompose any accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/['']/g, "") // Remove apostrophes
    .replace(/[""]/g, "") // Remove smart quotes
    .replace(/[^\w\s]/g, " ") // Replace special characters with spaces
    .replace(/\s+/g, " ") // Normalize whitespace
    .toLowerCase()
    .trim();
}

/**
 * Detects if text contains Arabic characters
 * Arabic range: U+0600 to U+06FF (Arabic block)
 */
export function containsArabic(text: string): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/g.test(text);
}

/**
 * Detects if text contains French accented characters
 */
export function containsFrenchAccents(text: string): boolean {
  if (!text) return false;
  return /[àáâäæçèéêëìíîïñòóôöœùúûüÿ]/i.test(text);
}

/**
 * Comprehensive text normalization for multilingual search
 * Automatically detects language and applies appropriate normalization
 */
export function normalizeTextForSearch(text: string): string {
  if (!text) return "";

  // Split text into words to handle mixed languages better
  const words = text.split(/\s+/);

  const normalizedWords = words.map((word) => {
    if (!word) return word;

    // Apply Arabic normalization if word contains Arabic characters
    if (containsArabic(word)) {
      return normalizeArabicText(word);
    }

    // Apply French normalization for accented characters
    if (containsFrenchAccents(word)) {
      return normalizeFrenchText(word);
    }

    // Apply English normalization for special characters
    return normalizeEnglishText(word);
  });

  return normalizedWords.join(" ").trim();
}

/**
 * Creates search-friendly version of Arabic text for PostgreSQL queries
 * @deprecated Use normalizeTextForSearch instead
 */
export function prepareArabicForSearch(text: string): string {
  return normalizeArabicText(text);
}

/**
 * Prepares Arabic text for highlighting - removes diacritics for better matching
 * @deprecated Use normalizeTextForSearch instead
 */
export function prepareArabicForHighlight(text: string): string {
  return normalizeArabicText(text);
}

/**
 * Creates both original and normalized versions of search terms
 * for comprehensive matching
 */
export function createSearchVariants(query: string): string[] {
  const variants = new Set<string>();

  // Add original query
  variants.add(query.trim());

  // Add normalized version
  const normalized = normalizeTextForSearch(query);
  if (normalized !== query.trim()) {
    variants.add(normalized);
  }

  // Add lowercase version
  variants.add(query.toLowerCase().trim());

  // For Arabic text, also add version without diacritics
  if (containsArabic(query)) {
    variants.add(normalizeArabicText(query));
  }

  // For French text, also add version without accents
  if (containsFrenchAccents(query)) {
    variants.add(normalizeFrenchText(query));
  }

  return Array.from(variants).filter((v) => v.length > 0);
}
