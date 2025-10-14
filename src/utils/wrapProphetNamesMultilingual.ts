/**
 * Multilingual utilities for wrapping Prophet names with styling markup
 * Provides formatting for English and Arabic texts similar to the French implementation
 */

export function wrapEnglishProphetNames(text: string): string {
  if (!text) return "";

  let result = text;

  // Replace salutations first, then wrap titles and symbols separately

  // Step 1: Replace salutations with symbol
  result = result.replace(
    /\(may\s+(?:the\s+)?peace\s+(?:and\s+blessings\s+)?of\s+Allah\s+be\s+upon\s+him\)/gi,
    " ﷺ"
  );
  result = result.replace(/\(peace\s+be\s+upon\s+him\)/gi, " ﷺ");
  result = result.replace(
    /\(peace\s+and\s+blessings\s+(?:of\s+Allah\s+)?(?:be\s+)?upon\s+him\)/gi,
    " ﷺ"
  );
  result = result.replace(
    /\(blessings\s+and\s+peace\s+be\s+upon\s+him\)/gi,
    " ﷺ"
  );

  // Replace complete phrases with titles and salutations
  result = result.replace(
    /\bProphet\s+of\s+Allah\s+\(may\s+peace\s+and\s+blessings\s+be\s+upon\s+him\)/gi,
    "~~Prophet of Allah~~ ~~ﷺ~~"
  );
  result = result.replace(
    /\bApostle\s+\(may\s+peace\s+and\s+blessings\s+be\s+upon\s+him\)/gi,
    "~~Apostle~~ ~~ﷺ~~"
  );
  result = result.replace(
    /\bMessenger\s+of\s+Allah\s+\(may\s+peace\s+and\s+blessings\s+be\s+upon\s+him\)/gi,
    "~~Messenger of Allah~~ ~~ﷺ~~"
  );

  // Remove any remaining parentheses around the symbol ﷺ
  result = result.replace(/\(\s*ﷺ\s*\)/g, " ﷺ");

  // Replace repetitive "He (the Holy Prophet)", "He (the Prophet)", "He (the Messenger)" with styled "He"
  result = result.replace(/\bHe\s+\(the\s+Holy\s+Prophet\)/gi, "~~He~~");
  result = result.replace(/\bHe\s+\(the\s+Prophet\)/gi, "~~He~~");
  result = result.replace(/\bHe\s+\(the\s+Messenger\)/gi, "~~He~~");

  // Step 2: Clean up extra spaces
  result = result.replace(/\s+/g, " ");

  // Step 3: Wrap titles when followed by ﷺ
  result = result.replace(/\b(Messenger\s+of\s+Allah)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/\b(Prophet\s+of\s+Allah)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/\b(Holy\s+Prophet)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/\b(Prophet\s+Muhammad)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/\b(Prophet)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/\b(Messenger)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/\b(Apostle)\s+ﷺ/gi, "~~$1~~ ~~ﷺ~~");

  // Step 4: Wrap standalone titles (that don't already have ﷺ) - Process longer phrases first
  result = result.replace(
    /\b(Messenger\s+of\s+Allah)(?!\s*~~)(?!\s*ﷺ)/gi,
    "~~$1~~"
  );
  result = result.replace(
    /\b(Prophet\s+of\s+Allah)(?!\s*~~)(?!\s*ﷺ)/gi,
    "~~$1~~"
  );
  result = result.replace(
    /\b(Prophet\s+Muhammad)(?!\s*~~)(?!\s*ﷺ)/gi,
    "~~$1~~"
  );
  result = result.replace(/\b(Holy\s+Prophet)(?!\s*~~)(?!\s*ﷺ)/gi, "~~$1~~");
  result = result.replace(
    /\b(Prophet)(?!\s*~~)(?!\s*ﷺ)(?!\s+of\s+Allah)(?!\s+Muhammad)/gi,
    "~~$1~~"
  );
  result = result.replace(
    /\b(Messenger)(?!\s*~~)(?!\s*ﷺ)(?!\s+of\s+Allah)/gi,
    "~~$1~~"
  );
  result = result.replace(/\b(Apostle)(?!\s*~~)(?!\s*ﷺ)/gi, "~~$1~~");

  // Step 5: Wrap standalone ﷺ symbols
  result = result.replace(/(?<!~~)\s*ﷺ(?!~~)/g, " ~~ﷺ~~");

  return result.trim();
}

export function wrapArabicProphetNames(text: string): string {
  if (!text) return "";

  let result = text;

  // Step 1: Replace Arabic salutations with symbol
  result = result.replace(/صلى الله عليه وسلم/g, " ﷺ");
  result = result.replace(/عليه الصلاة والسلام/g, " ﷺ");
  result = result.replace(/عليه السلام/g, " ﷺ");

  // Remove any remaining parentheses around the symbol ﷺ
  result = result.replace(/\(\s*ﷺ\s*\)/g, " ﷺ");

  // Step 2: Clean up extra spaces
  result = result.replace(/\s+/g, " ");

  // Step 3: Wrap titles when followed by ﷺ
  result = result.replace(/(رسول الله)\s+ﷺ/g, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/(النبي)\s+ﷺ/g, "~~$1~~ ~~ﷺ~~");
  result = result.replace(/(الرسول)\s+ﷺ/g, "~~$1~~ ~~ﷺ~~");

  // Step 4: Wrap standalone titles (that don't already have ﷺ)
  result = result.replace(/(رسول الله)(?!\s*~~)(?!\s*ﷺ)/g, "~~$1~~");
  result = result.replace(/(النبي)(?!\s*~~)(?!\s*ﷺ)/g, "~~$1~~");
  result = result.replace(/(الرسول)(?!\s*~~)(?!\s*ﷺ)/g, "~~$1~~");

  // Step 5: Wrap standalone ﷺ symbols
  result = result.replace(/(?<!~~)\s*ﷺ(?!~~)/g, " ~~ﷺ~~");

  return result.trim();
}
