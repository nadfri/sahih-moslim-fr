export const cleanArabicText = (text: string): string => {
  if (!text) {
    return "";
  }

  let cleanedText = text;

  cleanedText = cleanedText.replace(/[\u200B-\u200F\uFEFF]/g, "");

  cleanedText = cleanedText.replace(/\u0640/g, "");

  cleanedText = cleanedText.replace(/["'«»]/g, "");

  cleanedText = cleanedText.replace(/\s+([،.:;؟])/g, "$1");

  cleanedText = cleanedText.replace(/\s+/g, " ");

  cleanedText = cleanedText.trim();

  return cleanedText;
};
