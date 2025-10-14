import { MarkdownHighlighter } from "@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter";
import {
  formatHadithNarration,
  splitIntoParagraphs,
} from "@/src/utils/formatEnglishText";
import { wrapEnglishProphetNames } from "@/src/utils/wrapProphetNamesMultilingual";

type Props = {
  matn: string;
  highlight?: string;
};

export function Matn_en({ matn, highlight }: Props) {
  // Check if text already contains manual paragraph breaks (double line breaks)
  const hasManualParagraphs = matn.includes("\n\n");

  let paragraphs: string[];

  if (hasManualParagraphs) {
    // If manual paragraphs exist, respect them and don't apply automatic formatting
    paragraphs = matn
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  } else {
    // Apply automatic formatting only if no manual paragraphs exist
    const formattedText = formatHadithNarration(matn);
    paragraphs = splitIntoParagraphs(formattedText);
  }

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-pretty">
      {paragraphs.map((paragraph, index) => {
        // Apply Prophet name formatting to each paragraph individually
        const prophetFormattedParagraph = wrapEnglishProphetNames(paragraph);
        return (
          <div
            key={index}
            className="text-base"
          >
            <MarkdownHighlighter highlight={highlight}>
              {prophetFormattedParagraph}
            </MarkdownHighlighter>
          </div>
        );
      })}
    </div>
  );
}
