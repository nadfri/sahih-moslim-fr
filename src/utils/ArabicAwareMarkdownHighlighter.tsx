"use client";

import { useMemo } from "react";

import { MarkdownHighlighter } from "./MarkdownHighlighter";
import { normalizeArabicText } from "./normalizeArabicText";

type Props = {
  children: string;
  highlight?: string;
};

/**
 * Enhanced Markdown highlighter specifically for Arabic text normalization
 * This component handles Arabic diacritics normalization for better highlighting
 */
export function ArabicAwareMarkdownHighlighter({ children, highlight }: Props) {
  // Pre-process content to create a mapping for better Arabic highlighting
  const processedContent = useMemo(() => {
    if (!highlight || !children) return children;

    // Check if highlight contains Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(highlight);

    if (!hasArabic) {
      return children; // No Arabic, use original content
    }

    // For Arabic highlighting, we need to normalize both content and search term
    const normalizedHighlight = normalizeArabicText(highlight);

    // Return original content - MarkdownHighlighter will handle the rest
    return children;
  }, [children, highlight]);

  // For Arabic text, also pass the normalized version of the highlight term
  const enhancedHighlight = useMemo(() => {
    if (!highlight) return highlight;

    const hasArabic = /[\u0600-\u06FF]/.test(highlight);
    if (hasArabic) {
      return normalizeArabicText(highlight);
    }

    return highlight;
  }, [highlight]);

  return (
    <MarkdownHighlighter highlight={enhancedHighlight}>
      {processedContent}
    </MarkdownHighlighter>
  );
}
