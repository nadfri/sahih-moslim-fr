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
 * Creates search-friendly version of Arabic text for PostgreSQL queries
 */
export function prepareArabicForSearch(text: string): string {
  return normalizeArabicText(text);
}

/**
 * Prepares Arabic text for highlighting - removes diacritics for better matching
 */
export function prepareArabicForHighlight(text: string): string {
  return normalizeArabicText(text);
}

/**
 * Detects if text contains Arabic characters
 * Arabic range: U+0600 to U+06FF (Arabic block)
 */
export function containsArabic(text: string): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/g.test(text);
}
