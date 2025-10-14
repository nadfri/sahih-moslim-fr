import { MarkdownHighlighter } from "@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter";

type Props = {
  matn: string;
  highlight?: string;
};

export function Matn({ matn, highlight }: Props) {
  return (
    <MarkdownHighlighter highlight={highlight}>{matn}</MarkdownHighlighter>
  );
}
