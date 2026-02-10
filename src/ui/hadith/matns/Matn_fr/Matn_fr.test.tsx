import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Matn_fr } from "./Matn_fr";

// Mock MarkdownHighlighter component
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

describe("Matn_fr Component", () => {
  describe("Rendering", () => {
    it("renders French matn text with MarkdownHighlighter", () => {
      const frenchText = "C'est un texte français.";
      render(<Matn_fr matn={frenchText} />);

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
      expect(screen.getByText(frenchText)).toBeInTheDocument();
    });

    it("renders empty string without errors", () => {
      const { container } = render(<Matn_fr matn="" />);
      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it("renders very long French text", () => {
      const longText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(20);
      render(<Matn_fr matn={longText} />);

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("passes matn content to MarkdownHighlighter", () => {
      const frenchText = "Hadith en français";
      render(<Matn_fr matn={frenchText} />);

      expect(screen.getByText(frenchText)).toBeInTheDocument();
    });

    it("passes highlight prop to MarkdownHighlighter", () => {
      const frenchText = "Hadith français";
      const highlight = "français";

      render(
        <Matn_fr
          matn={frenchText}
          highlight={highlight}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toHaveAttribute(
        "data-highlight",
        highlight
      );
    });

    it("renders without highlight prop", () => {
      const frenchText = "Hadith français";
      render(<Matn_fr matn={frenchText} />);

      const element = screen.getByTestId("markdown-highlighter");
      expect(element.getAttribute("data-highlight")).toBeNull();
    });
  });

  describe("French text support", () => {
    it("handles French special characters correctly", () => {
      const textWithAccents = "Récit avec caractères: é, è, ê, à, ù, ô, ç";
      render(<Matn_fr matn={textWithAccents} />);

      expect(screen.getByText(textWithAccents)).toBeInTheDocument();
    });

    it("handles French apostrophes and quotation marks", () => {
      const textWithPunctuation =
        "C'est l'histoire d'un prophète « que la paix soit sur lui »";
      render(<Matn_fr matn={textWithPunctuation} />);

      expect(screen.getByText(textWithPunctuation)).toBeInTheDocument();
    });

    it("renders French hadith with proper formatting", () => {
      const hadithText = "Le Prophète a dit: Celui qui croit en Allah...";
      render(<Matn_fr matn={hadithText} />);

      expect(screen.getByText(hadithText)).toBeInTheDocument();
    });
  });
});
