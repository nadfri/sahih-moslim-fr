import { fireEvent, screen } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Matn_ar } from "./Matn_ar/Matn_ar";
import { Matn_fr } from "./Matn_fr/Matn_fr";

// Mock data for testing
const mockHadith = {
  matn_ar: "قال رسول الله صلى الله عليه وسلم: من كذب علي متعمدا",
  matn_fr:
    "Le Messager d'Allah (que la paix et les bénédictions d'Allah soient sur lui) a dit : Quiconque ment délibérément à mon sujet",
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

// Mock the containsArabic utility
vi.mock("@/src/utils/normalizeArabicText", () => ({
  containsArabic: vi.fn((text: string) => {
    // Simple Arabic detection for testing
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  }),
  prepareArabicForHighlight: vi.fn((text: string) => {
    // Simple mock that removes diacritics
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
  }),
}));

describe("Matn Components Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render both French and Arabic components together", () => {
    renderWithI18n(
      <div>
        <Matn_fr matn={mockHadith.matn_fr} />
        <Matn_ar matn={mockHadith.matn_ar} />
      </div>
    );

    // French text should be visible
    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();

    // Arabic toggle button should be present
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(
      "Voir la version arabe"
    );
  });

  it("should highlight search terms in both French and Arabic texts", () => {
    const searchTerm = "الله"; // Arabic term

    renderWithI18n(
      <div>
        <Matn_fr
          matn={mockHadith.matn_fr}
          highlight={searchTerm}
        />
        <Matn_ar
          matn={mockHadith.matn_ar}
          highlight={searchTerm}
        />
      </div>
    );

    // Arabic should auto-show because highlight contains Arabic
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");

    // Check that highlighting occurred in Arabic text
    const markElements = document.querySelectorAll("mark");
    expect(markElements.length).toBeGreaterThan(0);
  });

  it("should handle French search terms correctly", () => {
    const frenchTerm = "Messager";

    renderWithI18n(
      <div>
        <Matn_fr
          matn={mockHadith.matn_fr}
          highlight={frenchTerm}
        />
        <Matn_ar
          matn={mockHadith.matn_ar}
          highlight={frenchTerm}
        />
      </div>
    );

    // Arabic should not auto-show for French terms
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");

    // French highlighting should work
    const markElements = document.querySelectorAll("mark");
    expect(markElements.length).toBeGreaterThan(0);
    expect(markElements[0]).toHaveTextContent(frenchTerm);
  });

  it("should maintain independent state between components", () => {
    renderWithI18n(
      <div>
        <Matn_fr matn={mockHadith.matn_fr} />
        <Matn_ar matn={mockHadith.matn_ar} />
      </div>
    );

    const toggleButton = screen.getByRole("button");
    const arabicContainer = document.querySelector("[id]");

    // Initially hidden
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");

    // Show Arabic
    fireEvent.click(toggleButton);
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
    expect(toggleButton).toHaveTextContent("Masquer la version arabe");

    // Hide Arabic
    fireEvent.click(toggleButton);
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
    expect(toggleButton).toHaveTextContent("Voir la version arabe");

    // French text should remain visible throughout
    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
  });

  it("should handle mixed content scenarios", () => {
    const mixedHighlight = "رسول"; // Arabic in search

    renderWithI18n(
      <div>
        <Matn_fr
          matn="Le Prophète ﷺ a dit"
          highlight={mixedHighlight}
        />
        <Matn_ar
          matn="قال النبي ﷺ"
          highlight={mixedHighlight}
        />
      </div>
    );

    // Arabic should auto-show for Arabic search terms
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");

    // Both texts should be visible
    expect(screen.getByText("Le Prophète ﷺ a dit")).toBeInTheDocument();
    // Arabic text is in DOM but may be fragmented by highlighting
  });

  it("should handle empty search terms gracefully", () => {
    renderWithI18n(
      <div>
        <Matn_fr
          matn={mockHadith.matn_fr}
          highlight=""
        />
        <Matn_ar
          matn={mockHadith.matn_ar}
          highlight=""
        />
      </div>
    );

    // No highlighting should occur
    const markElements = document.querySelectorAll("mark");
    expect(markElements).toHaveLength(0);

    // Arabic should not auto-show for empty highlight
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
  });

  it("should handle undefined highlight props", () => {
    renderWithI18n(
      <div>
        <Matn_fr matn={mockHadith.matn_fr} />
        <Matn_ar matn={mockHadith.matn_ar} />
      </div>
    );

    // Should render without errors
    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();

    // No highlighting should occur
    const markElements = document.querySelectorAll("mark");
    expect(markElements).toHaveLength(0);
  });

  it("should preserve accessibility features", () => {
    renderWithI18n(
      <div>
        <Matn_fr matn={mockHadith.matn_fr} />
        <Matn_ar matn={mockHadith.matn_ar} />
      </div>
    );

    const toggleButton = screen.getByRole("button");

    // Check ARIA attributes
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(toggleButton).toHaveAttribute("aria-controls");

    // Click to expand
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });
});
