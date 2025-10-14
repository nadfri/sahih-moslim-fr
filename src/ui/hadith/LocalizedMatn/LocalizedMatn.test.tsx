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

    expect(screen.getByTestId("matn-fr")).toBeInTheDocument();
    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
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

    expect(screen.getByTestId("matn-ar")).toBeInTheDocument();
    expect(screen.getByText(mockHadith.matn_ar)).toBeInTheDocument();
    expect(screen.getByTestId("matn-ar")).toHaveAttribute("data-edit", "true");
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

    expect(screen.getByTestId("matn-en")).toBeInTheDocument();
    expect(screen.getByText(hadithWithEnglish.matn_en)).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("should fallback to French when Arabic locale is used but no matn_ar exists", () => {
    const hadithWithoutArabic = {
      ...mockHadith,
      matn_ar: "", // No Arabic text
    };

    renderWithI18n(<LocalizedMatn hadith={hadithWithoutArabic} />, {
      locale: "ar",
    });

    expect(screen.getByTestId("matn-fr")).toBeInTheDocument();
    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
  });

  it("should fallback to French when English locale is used but no matn_en exists", () => {
    const hadithWithoutEnglish = {
      ...mockHadith,
      matn_en: undefined, // No English text
    };

    renderWithI18n(<LocalizedMatn hadith={hadithWithoutEnglish} />, {
      locale: "en",
    });

    expect(screen.getByTestId("matn-fr")).toBeInTheDocument();
    expect(screen.getByText(mockHadith.matn_fr)).toBeInTheDocument();
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

    expect(screen.getByTestId("matn-ar")).toHaveAttribute("data-edit", "true");
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
    expect(screen.getByTestId("matn-fr")).toBeInTheDocument();
  });
});
