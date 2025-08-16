import { Components } from "react-markdown";

import { MarkdownHighlighter } from "@/src/utils/MarkdownHighlighter";

type Props = {
  matn: string;
  highlight?: string;
};

export function Matn_fr({ matn, highlight }: Props) {
  // Custom renderers for ReactMarkdown
  const customRenderers: Components = {
    // Override the default <strong> tag rendering
    strong: ({ ...props }) => (
      <span
        className="text-emerald-600 dark:text-emerald-400 font-medium"
        {...props}
      />
    ),
    // Override the default <em> tag rendering
    em: ({ ...props }) => (
      <em
        className="border-l-4 rounded-md border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 p-3 my-4 text-amber-800 dark:text-amber-400 italic block"
        {...props}
      />
    ),

    // Override the default <s> tag rendering
    del: ({ ...props }) => (
      <del
        className="text-blue-600 dark:text-blue-500 no-underline font-medium"
        {...props}
      />
    ),
  };

  return (
    <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed text-pretty">
      <MarkdownHighlighter
        highlight={highlight}
        components={customRenderers}
      >
        {matn}
      </MarkdownHighlighter>
    </div>
  );
}
