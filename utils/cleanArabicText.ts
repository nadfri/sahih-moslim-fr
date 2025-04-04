export const cleanArabicText = (text: string) => {
  return text
    .replace(/[\u200B-\u200D\uFEFF\u200F]/g, "") // Supprime les caractères invisibles et le RLM (U+200F)
    .replace(/\s+/g, " ") // Normalise les espaces
    .trim();
};
