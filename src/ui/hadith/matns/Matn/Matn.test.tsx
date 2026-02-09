import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Matn } from "./Matn";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

vi.mock("@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter", () => ({
  MarkdownHighlighter: ({
    children,
    highlight,
  }: {
    children: string;
    highlight?: string;
  }) => {
    if (highlight) {
      const regex = new RegExp(`(${highlight})`, "gi");
      const highlightedContent = children.replace(regex, "<mark>$1</mark>");
      return (
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      );
    }
    return <div className="markdown-content">{children}</div>;
  },
}));

vi.mock("@/src/utils/normalizeArabicText", () => ({
  containsArabic: (text: string) => /[\u0600-\u06FF]/.test(text),
}));

describe("Matn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const frenchText = "Ceci est un hadith en français";
  const englishText = "This is a hadith in English";
  const arabicText = "هذا حديث باللغة العربية";

  describe("French version", () => {
    it("should render French text correctly", () => {
      renderWithI18n(
        <Matn
          matn={frenchText}
          lang="fr"
        />
      );
      expect(screen.getByText(frenchText)).toBeInTheDocument();
    });

    it("should highlight text when highlight is provided", () => {
      renderWithI18n(
        <Matn
          matn="Ceci est un test"
          lang="fr"
          highlight="test"
        />
      );

      const markElement = document.querySelector("mark");
      expect(markElement).toBeInTheDocument();
      expect(markElement?.textContent).toBe("test");
    });
  });

  describe("English version", () => {
    it("should render English text correctly", () => {
      renderWithI18n(
        <Matn
          matn={englishText}
          lang="en"
        />
      );
      expect(screen.getByText(englishText)).toBeInTheDocument();
    });

    it("should respect manual paragraphs", () => {
      const text = "First paragraph.\n\nSecond paragraph.";
      renderWithI18n(
        <Matn
          matn={text}
          lang="en"
        />
      );

      const container = document.querySelector(".space-y-4");
      expect(container?.children.length).toBe(2);
    });

    it("should handle empty text gracefully", () => {
      renderWithI18n(
        <Matn
          matn=""
          lang="en"
        />
      );

      const container = document.querySelector(".space-y-4");
      expect(container).not.toBeInTheDocument();
    });
  });

  describe("Arabic version", () => {
    it("should render Arabic text without toggle by default", () => {
      renderWithI18n(
        <Matn
          matn={arabicText}
          lang="ar"
        />
      );
      expect(screen.getByText(arabicText)).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render Arabic text with toggle when showToggle is true", () => {
      renderWithI18n(
        <Matn
          matn={arabicText}
          lang="ar"
          showToggle={true}
        />
      );

      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toBeInTheDocument();
    });

    it("should toggle Arabic visibility on click", async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <Matn
          matn={arabicText}
          lang="ar"
          showToggle={true}
        />
      );

      const toggleButton = screen.getByRole("button");
      const arabicContainer = document.querySelector("[id]");

      expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
      await user.click(toggleButton);
      expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
    });

    it("should auto-show Arabic when highlight contains Arabic", () => {
      renderWithI18n(
        <Matn
          matn={arabicText}
          lang="ar"
          showToggle={true}
          highlight="رسول"
        />
      );

      const arabicContainer = document.querySelector("[id]");
      expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
    });
  });
});
