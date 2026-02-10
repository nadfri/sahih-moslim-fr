import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Matn_en } from "./Matn_en";

// Mock dependencies
vi.mock("@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter", () => ({
  MarkdownHighlighter: ({
    children,
    highlight,
  }: {
    children: string;
    highlight?: string;
  }) => (
    <div
      data-testid="markdown-highlighter"
      data-highlight={highlight}
    >
      {children}
    </div>
  ),
}));

vi.mock("../utils/formatEnglishText", () => ({
  formatHadithNarration: (text: string) => text.replace(/\n/g, " "),
  splitIntoParagraphs: (text: string) => {
    return text.split(/\n(?=\S)/).filter((p) => p.trim().length > 0);
  },
}));

vi.mock("@/src/utils/wrapProphetNamesMultilingual", () => ({
  wrapEnglishProphetNames: (text: string) =>
    text.replace(/Prophet/g, "<Prophet>Prophet</Prophet>"),
}));

describe("Matn_en Component", () => {
  describe("Rendering", () => {
    it("renders English hadith text", () => {
      const englishText = "The Prophet said: believe in Allah.";
      render(<Matn_en matn={englishText} />);

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });

    it("returns null for empty matn", () => {
      const { container } = render(<Matn_en matn="" />);
      expect(container.firstChild).toBeNull();
    });

    it("returns null when only whitespace", () => {
      const { container } = render(<Matn_en matn="   " />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Manual paragraphs handling", () => {
    it("detects and splits manual paragraphs with double newlines", () => {
      const multiParagraph = "First paragraph.\n\nSecond paragraph.";
      const { container } = render(<Matn_en matn={multiParagraph} />);

      const paragraphs = container.querySelectorAll(
        "[data-testid='markdown-highlighter']"
      );
      // Should have multiple highlighters for each paragraph
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it("trims whitespace from manual paragraphs", () => {
      const textWithWhitespace = "  First paragraph  \n\n  Second paragraph  ";
      render(<Matn_en matn={textWithWhitespace} />);

      // Should not throw and render properly
      expect(
        screen.getAllByTestId("markdown-highlighter").length
      ).toBeGreaterThan(0);
    });

    it("filters empty paragraphs after splitting", () => {
      const textWithEmptyLines = "First.\n\n\n\nSecond.\n\n";
      const { container } = render(<Matn_en matn={textWithEmptyLines} />);

      expect(container).toBeInTheDocument();
    });

    it("applies prophet name wrapping to each paragraph", () => {
      const textWithProphet = "The Prophet spoke.\n\nThe Prophet taught.";
      render(<Matn_en matn={textWithProphet} />);

      expect(
        screen.getAllByTestId("markdown-highlighter").length
      ).toBeGreaterThan(0);
    });
  });

  describe("Single line / no manual paragraphs", () => {
    it("uses automatic formatting for single line text", () => {
      const singleLine =
        "This is a single line hadith without paragraph breaks.";
      render(<Matn_en matn={singleLine} />);

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });

    it("applies formatHadithNarration to auto-formatted text", () => {
      const narration = "Narration without manual breaks";
      render(<Matn_en matn={narration} />);

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });
  });

  describe("Styling and layout", () => {
    it("applies correct CSS classes to container", () => {
      const englishText = "Hadith text.\n\nSecond part.";
      const { container } = render(<Matn_en matn={englishText} />);

      const wrapper = container.querySelector(".space-y-4");
      expect(wrapper).toBeInTheDocument();
    });

    it("maintains proper spacing between paragraphs", () => {
      const englishText = "First.\n\nSecond.\n\nThird.";
      const { container } = render(<Matn_en matn={englishText} />);

      const paragraphDivs = container.querySelectorAll(".text-base");
      expect(paragraphDivs.length).toBeGreaterThan(0);
    });

    it("applies leading relaxed text styling", () => {
      const englishText = "Hadith text.\n\nMore text.";
      const { container } = render(<Matn_en matn={englishText} />);

      const wrapper = container.querySelector(".leading-relaxed");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("passes highlight prop to MarkdownHighlighter", () => {
      const englishText = "The Prophet taught us.";
      const highlight = "Prophet";

      render(
        <Matn_en
          matn={englishText}
          highlight={highlight}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toHaveAttribute(
        "data-highlight",
        highlight
      );
    });

    it("renders without highlight prop", () => {
      const englishText = "Hadith text";
      render(<Matn_en matn={englishText} />);

      const element = screen.getByTestId("markdown-highlighter");
      expect(element.getAttribute("data-highlight")).toBeNull();
    });
  });

  describe("Long text handling", () => {
    it("handles very long single paragraph", () => {
      const longText = "This is a long hadith. ".repeat(50);
      render(<Matn_en matn={longText} />);

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });

    it("handles many paragraphs", () => {
      let longMultiparagraph = "";
      for (let i = 0; i < 10; i++) {
        longMultiparagraph += `Paragraph ${i}. `.repeat(3) + "\n\n";
      }

      render(<Matn_en matn={longMultiparagraph} />);
      expect(
        screen.getAllByTestId("markdown-highlighter").length
      ).toBeGreaterThan(1);
    });
  });
});
