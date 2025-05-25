import { escapeRegExp } from "./escapeRegExp";

// Process text to wrap highlight matches in <mark> tags for HTML rendering
export function highlightText(text: string, highlight?: string): string {
  return highlight
    ? text.replace(
        new RegExp(`(${escapeRegExp(highlight)})`, "gi"),
        '<mark class="bg-yellow-200">$1</mark>'
      )
    : text;
}
