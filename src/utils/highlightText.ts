export function highlightText(text: string, highlight?: string): string {
  if (!highlight || highlight.trim() === "") {
    return text;
  }

  // Escape special regex characters in the highlight string
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create a case-insensitive regex with global flag
  const regex = new RegExp(escapedHighlight, "gi");

  // Replace matches with highlighted version
  return text.replace(regex, (match) => {
    return `<mark className="bg-yellow-200">${match}</mark>`;
  });
}
