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
  // Format the text automatically for better readability
  const formattedText = formatHadithNarration(matn);
  // Split into paragraphs BEFORE applying Prophet name formatting to preserve structure
  const paragraphs = splitIntoParagraphs(formattedText);

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
