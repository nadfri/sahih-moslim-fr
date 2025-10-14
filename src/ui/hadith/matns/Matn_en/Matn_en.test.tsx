import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Matn_en } from "./Matn_en";

// Mock the MarkdownHighlighter component
vi.mock("@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter", () => ({
  MarkdownHighlighter: ({
    children,
    highlight,
  }: {
    children: string;
    highlight?: string;
  }) => {
    if (highlight) {
      // Simple mock highlighting by wrapping highlighted text in <mark>
      const regex = new RegExp(`(${highlight})`, "gi");
      const highlightedContent = children.replace(regex, "<mark>$1</mark>");
      return (
        <div
          className="markdown-content text-gray-700 dark:text-gray-300 leading-relaxed text-pretty whitespace-pre-line pb-3"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      );
    }
    return (
      <div className="markdown-content text-gray-700 dark:text-gray-300 leading-relaxed text-pretty whitespace-pre-line pb-3">
        {children}
      </div>
    );
  },
}));

describe("Matn_en Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render formatted English text", () => {
    const englishText =
      "It is reported on the authority of Anas b. Malik that he said: The Prophet (ﷺ) said: Five prayers during the day and the night.";

    render(<Matn_en matn={englishText} />);

    // Check that text is rendered (formatted version might be split)
    expect(
      screen.getByText(/It is reported on the authority/)
    ).toBeInTheDocument();
  });

  it("should handle text with Prophet's speech formatting", () => {
    const textWithSpeech =
      "The Messenger of Allah (ﷺ) said: You worship Allah and never associate anything with Him.";

    render(<Matn_en matn={textWithSpeech} />);

    // Check that the formatted text is rendered with Prophet name formatting
    // The text should now include wrapped titles and symbols
    expect(screen.getByText(/said: You worship Allah/)).toBeInTheDocument();
    // Check that the component contains the wrapped markup
    const container = document.querySelector(".markdown-content");
    expect(container?.textContent).toContain("~~Messenger of Allah~~");
    expect(container?.textContent).toContain("~~ﷺ~~");
  });

  it("should handle formatted text with proper structure", () => {
    const text = "This is a test of the English formatting system.";

    render(<Matn_en matn={text} />);

    // Check that the basic structure is rendered correctly
    const container = document.querySelector(".space-y-4");
    expect(container).toBeInTheDocument();

    // Check that the text content is present
    expect(
      screen.getByText(/test of the English formatting/)
    ).toBeInTheDocument();

    // Check that at least one paragraph div is created
    expect(container?.children.length).toBeGreaterThanOrEqual(1);
  });

  it("should handle highlighting in formatted text", () => {
    const text = "The Prophet said: Peace be upon him.";
    const highlight = "Prophet";

    render(
      <Matn_en
        matn={text}
        highlight={highlight}
      />
    );

    // Check that highlighting is applied
    const markElement = document.querySelector("mark");
    expect(markElement).toBeInTheDocument();
  });

  it("should handle empty text gracefully", () => {
    render(<Matn_en matn="" />);

    // Should not render anything for empty text
    const container = document.querySelector(".space-y-4");
    expect(container).not.toBeInTheDocument();
  });

  it("should format Islamic expressions correctly", () => {
    const textWithExpressions =
      "The Messenger of Allah (may peace of Allah be upon him) said something.";

    render(<Matn_en matn={textWithExpressions} />);

    // The formatting function should convert the expression to ﷺ
    expect(screen.getByText(/ﷺ/)).toBeInTheDocument();
  });

  it("should handle undefined highlight prop", () => {
    const text = "Simple English text";

    render(
      <Matn_en
        matn={text}
        highlight={undefined}
      />
    );

    expect(screen.getByText(text)).toBeInTheDocument();
    // No highlighting should occur
    const markElements = document.querySelectorAll("mark");
    expect(markElements).toHaveLength(0);
  });

  it("should maintain proper styling classes", () => {
    const text = "Test text";

    render(<Matn_en matn={text} />);

    const container = document.querySelector(".space-y-4");
    expect(container).toHaveClass(
      "space-y-4",
      "text-gray-700",
      "dark:text-gray-300",
      "leading-relaxed",
      "text-pretty"
    );
  });
});
