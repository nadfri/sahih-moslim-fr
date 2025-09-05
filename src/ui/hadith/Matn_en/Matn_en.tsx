import { MarkdownHighlighter } from "@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter";

type Props = {
  matn: string;
  highlight?: string;
};

export function Matn_en({ matn, highlight }: Props) {
  return (
    <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed text-pretty">
      <MarkdownHighlighter highlight={highlight}>{matn}</MarkdownHighlighter>
    </div>
  );
}
