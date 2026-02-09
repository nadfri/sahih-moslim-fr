/**
 * Utility to automatically format English hadith texts imported from JSON
 * Improves readability by adding proper paragraphs, punctuation, and spacing
 */

/**
 * Formats English hadith text by adding proper paragraphs and improving readability
 * @param text - Raw English text from JSON import
 * @returns Formatted text with proper paragraph breaks
 */
export function formatEnglishText(text: string): string {
  if (!text) return "";

  let formatted = text.trim();

  // Remove extra whitespace
  formatted = formatted.replace(/\s+/g, " ");

  // Add paragraph breaks before narration patterns
  formatted = formatted.replace(
    /(It is (?:reported|narrated) on the authority of)/g,
    "\n\n$1"
  );

  // Add paragraph breaks before Prophet's speech
  formatted = formatted.replace(
    /(The (?:Messenger of Allah|Prophet|Holy Prophet)[^.]*(?:said|remarked|replied|asked):\s*)/g,
    "\n\n$1"
  );

  // Add paragraph breaks before responses and dialogue
  formatted = formatted.replace(
    /(He \((?:the|a) (?:Holy Prophet|Prophet|Messenger|bedouin|inquirer|man)[^)]*\) (?:said|remarked|replied|asked):\s*)/g,
    "\n\n$1"
  );

  // Add paragraph breaks before specific inquiry patterns and descriptive transitions
  formatted = formatted.replace(
    /(He \(the inquirer\) (?:said|again said):\s*)/g,
    "\n\n$1"
  );

  // Add breaks after long contextual sentences that end with periods before new narratives
  formatted = formatted.replace(
    /(\. And then after taking about their affairs, added:)/g,
    ".\n\nAnd then after taking about their affairs, added:"
  );

  // Add breaks before direct speech introductions in narratives
  formatted = formatted.replace(
    /(\. I expected that my companion would authorize me to speak)/g,
    ".\n\nI expected that my companion would authorize me to speak"
  );

  // Add breaks before authority statements and oath declarations
  formatted = formatted.replace(/(Abdullah Ibn Umar swore by Him)/g, "\n\n$1");

  // Add paragraph breaks before narration transitions
  formatted = formatted.replace(
    /(The narrator said|Upon this|After having uttered|When he turned|Accidentally we came across|One day we were sitting|My companion and I surrounded him)/g,
    "\n\n$1"
  );

  // Add paragraph breaks for long narrative transitions
  formatted = formatted.replace(/(At last he sat with the)/g, "\n\n$1");

  // Add paragraph breaks before new speakers in dialogue
  formatted = formatted.replace(
    /\. (He said:|The man said:|The bedouin said:|The inquirer said:|He replied:|He remarked:)/g,
    ".\n\n$1"
  );

  // Add paragraph breaks for specific dialogue patterns in long narratives
  formatted = formatted.replace(/\. (He \([^)]+\) said:)/g, ".\n\n$1");

  // Improve spacing around parenthetical expressions
  formatted = formatted.replace(/\(\s+/g, "(");
  formatted = formatted.replace(/\s+\)/g, ")");

  // Fix spacing around quotes
  formatted = formatted.replace(/"\s+/g, '"');
  formatted = formatted.replace(/\s+"/g, '"');

  // Ensure proper spacing after periods
  formatted = formatted.replace(/\.([A-Z])/g, ". $1");

  // Clean up multiple consecutive line breaks
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Remove leading/trailing line breaks
  formatted = formatted.replace(/^\n+|\n+$/g, "");

  return formatted;
}

/**
 * Formats English text specifically for hadith narration patterns
 * Adds specific formatting for common Islamic terminology and expressions
 */
export function formatHadithNarration(text: string): string {
  if (!text) return "";

  let formatted = formatEnglishText(text);

  // Add emphasis formatting for Islamic expressions
  formatted = formatted.replace(
    /\(may (?:peace|the peace) (?:and blessings )?of Allah be upon him\)/g,
    "(ﷺ)"
  );

  formatted = formatted.replace(
    /\(may Allah be pleased with (?:him|her|them)\)/g,
    "(رضي الله عنه)"
  );

  // Format common Arabic terms
  formatted = formatted.replace(/\bﷺ\b/g, " ﷺ ");

  // Clean up extra spaces around Arabic symbols
  formatted = formatted.replace(/\s+ﷺ\s+/g, " ﷺ ");

  return formatted.trim();
}

/**
 * Splits long English text into readable paragraphs
 * @param text - Formatted English text
 * @returns Array of paragraph strings
 */
export function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];

  const paragraphs = text
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs;
}

/**
 * Detects if text contains English characters (Latin script)
 * @param text - Text to analyze
 * @returns True if text contains English/Latin characters
 */
export function containsEnglish(text: string): boolean {
  if (!text) return false;
  return /[a-zA-Z]/g.test(text);
}
