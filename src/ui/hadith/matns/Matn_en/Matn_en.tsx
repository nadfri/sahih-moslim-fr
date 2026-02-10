import { MarkdownHighlighter } from "@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter";
import {
  formatHadithNarration,
  splitIntoParagraphs,
} from "../utils/formatEnglishText";
import { wrapEnglishProphetNames } from "@/src/utils/wrapProphetNamesMultilingual";

type Props = {
  matn: string;
  highlight?: string;
};

export function Matn_en({ matn, highlight }: Props) {
  const hasManualParagraphs = matn.includes("\n\n");

  let paragraphs: string[];

  if (hasManualParagraphs) {
    paragraphs = matn
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  } else {
    const formattedText = formatHadithNarration(matn);
    paragraphs = splitIntoParagraphs(formattedText);
  }

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-pretty">
      {paragraphs.map((paragraph, index) => {
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
