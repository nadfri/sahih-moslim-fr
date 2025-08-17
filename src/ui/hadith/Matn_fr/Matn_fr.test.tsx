import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Matn_fr } from "./Matn_fr";

// Mock data for testing
const mockHadith = {
  matn_fr:
    "Le Messager d'Allah (que la paix et les bénédictions d'Allah soient sur lui) a dit",
  matn_ar: "قال رسول الله صلى الله عليه وسلم",
};

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
      return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
    }
    return <div>{children}</div>;
  },
}));

describe("Matn_fr Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the French text content", () => {
    render(<Matn_fr matn={mockHadith.matn_fr} />);

    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<Matn_fr matn={mockHadith.matn_fr} />);

    const container = document.querySelector(".space-y-3");
    expect(container).toHaveClass(
      "space-y-3",
      "text-gray-700",
      "dark:text-gray-300",
      "leading-relaxed",
      "text-pretty"
    );
  });

  it("should pass highlight prop to MarkdownHighlighter", () => {
    const highlightTerm = "test";
    render(
      <Matn_fr
        matn="This is a test text"
        highlight={highlightTerm}
      />
    );

    // Check if the highlight term is wrapped in <mark> tags
    const markElement = document.querySelector("mark");
    expect(markElement).toBeInTheDocument();
    expect(markElement?.textContent).toBe(highlightTerm);
  });

  it("should render without highlight when no highlight prop is provided", () => {
    render(<Matn_fr matn={mockHadith.matn_fr} />);

    // Check that no <mark> elements are present
    const markElements = document.querySelectorAll("mark");
    expect(markElements).toHaveLength(0);
  });

  it("should handle empty matn content", () => {
    render(<Matn_fr matn="" />);

    // Should render the container with proper classes
    const container = document.querySelector(".space-y-3");
    expect(container).toBeInTheDocument();
  });

  it("should handle markdown content correctly", () => {
    const markdownText = "**Bold text** and *italic text*";
    render(<Matn_fr matn={markdownText} />);

    // Our simple mock doesn't process markdown, so check for the raw text
    expect(screen.getByText(markdownText)).toBeInTheDocument();
  });

  it("should highlight multiple occurrences of the search term", () => {
    const textWithMultipleOccurrences = "Le Prophète a dit au Prophète";
    const highlightTerm = "Prophète";

    render(
      <Matn_fr
        matn={textWithMultipleOccurrences}
        highlight={highlightTerm}
      />
    );

    // Check that multiple <mark> elements are present
    const markElements = document.querySelectorAll("mark");
    expect(markElements.length).toBe(2);
  });

  it("should be case-insensitive when highlighting", () => {
    const text = "Le Prophète a dit";
    const highlightTerm = "prophète"; // lowercase

    render(
      <Matn_fr
        matn={text}
        highlight={highlightTerm}
      />
    );

    // Check if highlighting occurred despite case difference
    const markElement = document.querySelector("mark");
    expect(markElement).toBeInTheDocument();
  });

  it("should render long text content properly", () => {
    const longText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5);
    render(<Matn_fr matn={longText} />);

    // Check that container is rendered with proper classes
    const container = document.querySelector(".space-y-3");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("text-gray-700", "dark:text-gray-300");
  });

  it("should handle special characters in text", () => {
    const textWithSpecialChars = "Le Messager d'Allah ﷺ a dit: « Bismillah »";
    render(<Matn_fr matn={textWithSpecialChars} />);

    expect(screen.getByText(textWithSpecialChars)).toBeInTheDocument();
  });

  it("should handle undefined highlight prop gracefully", () => {
    render(
      <Matn_fr
        matn={mockHadith.matn_fr}
        highlight={undefined}
      />
    );

    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
    const markElements = document.querySelectorAll("mark");
    expect(markElements).toHaveLength(0);
  });

  it("should handle empty highlight prop", () => {
    render(
      <Matn_fr
        matn={mockHadith.matn_fr}
        highlight=""
      />
    );

    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
    const markElements = document.querySelectorAll("mark");
    expect(markElements).toHaveLength(0);
  });
});
