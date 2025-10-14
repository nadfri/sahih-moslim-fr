import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocalizedMatn } from "./LocalizedMatn";
import { mockHadith } from "@/__tests__/mocks/mockHadith";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

// Mock the individual Matn components
vi.mock("@/src/ui/hadith/Matn/Matn", () => ({
  Matn: ({ matn, highlight }: { matn: string; highlight?: string }) => (
    <div data-testid="matn-fr">
      {highlight && <mark>{highlight}</mark>}
      {matn}
    </div>
  ),
}));

vi.mock("@/src/ui/hadith/Matn_ar/Matn_ar", () => ({
  Matn_ar: ({
    matn,
    highlight,
    edit,
  }: {
    matn: string;
    highlight?: string;
    edit?: boolean;
  }) => (
    <div
      data-testid="matn-ar"
      data-edit={edit}
    >
      {highlight && <mark>{highlight}</mark>}
      {matn}
    </div>
  ),
}));

vi.mock("@/src/ui/hadith/Matn_en/Matn_en", () => ({
  Matn_en: ({ matn, highlight }: { matn: string; highlight?: string }) => (
    <div data-testid="matn-en">
      {highlight && <mark>{highlight}</mark>}
      {matn}
    </div>
  ),
}));

describe("LocalizedMatn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render French Matn component by default", () => {
    renderWithI18n(
      <LocalizedMatn
        hadith={mockHadith}
        highlight="test"
      />
    );

    // Test that French content is rendered (text is split by highlighting)
    expect(screen.getByText(/Ceci est un/)).toBeInTheDocument();
    expect(screen.getByText(/de hadith en français/)).toBeInTheDocument();
    // Test that the highlight is working
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should render Arabic Matn component when locale is 'ar' and matn_ar exists", () => {
    renderWithI18n(
      <LocalizedMatn
        hadith={mockHadith}
        highlight="test"
        edit={true}
      />,
      { locale: "ar" }
    );

    // Test that Arabic content is rendered
    expect(screen.getByText(mockHadith.matn_ar)).toBeInTheDocument();
    // Test that the Arabic component structure is present (border-t class from Matn_ar)
    expect(document.querySelector(".border-t")).toBeInTheDocument();
  });

  it("should render English Matn component when locale is 'en' and matn_en exists", () => {
    const hadithWithEnglish = {
      ...mockHadith,
      matn_en: "This is an English hadith text for testing purposes.",
    };

    renderWithI18n(
      <LocalizedMatn
        hadith={hadithWithEnglish}
        highlight="English"
      />,
      { locale: "en" }
    );

    // Test that English content is rendered (text is split by highlighting)
    expect(screen.getByText(/This is an/)).toBeInTheDocument();
    expect(
      screen.getByText(/hadith text for testing purposes/)
    ).toBeInTheDocument();
    // Test that the highlight is working
    expect(screen.getByText("English")).toBeInTheDocument();
    // Test that the English component structure is present (space-y-4 class)
    expect(document.querySelector(".space-y-4")).toBeInTheDocument();
  });

  it("should fallback to French when Arabic locale is used but no matn_ar exists", () => {
    const hadithWithoutArabic = {
      ...mockHadith,
      matn_ar: "", // No Arabic text
    };

    renderWithI18n(<LocalizedMatn hadith={hadithWithoutArabic} />, {
      locale: "ar",
    });

    // Test that it falls back to French content
    expect(screen.getByText(/Ceci est un/)).toBeInTheDocument();
    // Test that no Arabic toggle button is present
    expect(
      screen.queryByRole("button", { name: /voir le texte arabe/i })
    ).not.toBeInTheDocument();
  });

  it("should fallback to French when English locale is used but no matn_en exists", () => {
    const hadithWithoutEnglish = {
      ...mockHadith,
      matn_en: undefined, // No English text
    };

    renderWithI18n(<LocalizedMatn hadith={hadithWithoutEnglish} />, {
      locale: "en",
    });

    // Test that it falls back to French content
    expect(screen.getByText(/Ceci est un/)).toBeInTheDocument();
    // Test that no English-specific structure is present
    expect(document.querySelector(".space-y-4")).not.toBeInTheDocument();
  });

  it("should pass highlight prop to the selected component", () => {
    const highlightTerm = "test";

    renderWithI18n(
      <LocalizedMatn
        hadith={mockHadith}
        highlight={highlightTerm}
      />
    );

    expect(screen.getByText(highlightTerm)).toBeInTheDocument();
  });

  it("should pass edit prop to Arabic component", () => {
    renderWithI18n(
      <LocalizedMatn
        hadith={mockHadith}
        edit={true}
      />,
      { locale: "ar" }
    );

    // Test that Arabic content is rendered with edit mode
    expect(screen.getByText(mockHadith.matn_ar)).toBeInTheDocument();
    // Test that the Arabic component structure is present (border-t class from Matn_ar)
    expect(document.querySelector(".border-t")).toBeInTheDocument();
  });

  it("should handle missing hadith data gracefully", () => {
    const emptyHadith = {
      ...mockHadith,
      matn_fr: "",
      matn_ar: "",
      matn_en: "",
    };

    renderWithI18n(<LocalizedMatn hadith={emptyHadith} />);

    // Should still render the French component even with empty text
    // Test that MarkdownHighlighter is rendered (even with empty content)
    expect(document.querySelector(".markdown-content")).toBeInTheDocument();
  });
});
