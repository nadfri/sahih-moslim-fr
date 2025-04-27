export const cleanArabicText = (text: string): string => {
  if (!text) {
    return "";
  }

  let cleanedText = text;

  // 1. Remove zero-width characters
  cleanedText = cleanedText.replace(/[\u200B-\u200F\uFEFF]/gi, "");

  // 2. Remove Tatweel
  cleanedText = cleanedText.replace(/\u0640/gi, "");

  // 3. Remove specific quotes
  cleanedText = cleanedText.replace(/["'«»]/g, "");

  // 4. Normalize Non-Breaking Space (NBSP) to standard space
  cleanedText = cleanedText.replace(/\u00A0/g, " ");

  // 5. Collapse multiple consecutive standard spaces into a single standard space
  //    Using ' +' ensures we only collapse standard spaces after normalization.
  cleanedText = cleanedText.replace(/ +/g, " ");

  // 6. Remove a single standard space specifically before the target punctuation marks
  //    Targeting only the standard space ' ' explicitly.
  cleanedText = cleanedText.replace(/ ([،.:;؟])/g, "$1");

  // 7. Trim leading/trailing whitespace (trim handles various types, which is usually safe at the end)
  cleanedText = cleanedText.trim();

  return cleanedText;
};
