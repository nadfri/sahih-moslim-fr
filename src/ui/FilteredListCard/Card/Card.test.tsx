import { screen } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { describe, expect, it, vi } from "vitest";

import { Card } from "./Card";

import "@testing-library/jest-dom";

import { ItemType, VariantType } from "@/src/types/types";

// Mock ChapterIndex to avoid dependency on its implementation
vi.mock("@/src/ui/Card/ChapterIndex/ChapterIndex", () => ({
  ChapterIndex: ({ index }: { index: number }) => (
    <span data-testid="chapter-index">{index}</span>
  ),
}));

describe("Card", () => {
  const item: ItemType = {
    id: "id",
    name_fr: "Test Chapter",
    name_ar: null,
    name_en: null,
    slug: "test-chapter",
    hadithCount: 42,
    index: 3,
  };
  const variant: VariantType = "chapters";

  it("renders the card with correct data", () => {
    renderWithI18n(
      <Card
        item={item}
        variant={variant}
      />
    );
    // Check chapter name
    expect(screen.getByText("Test Chapter")).toBeInTheDocument();
    // Check hadith count
    expect(screen.getByText(/42 Hadiths/)).toBeInTheDocument();
    // Check chapter index (traduction)
    expect(screen.getByText(/Chapitre 3/)).toBeInTheDocument();
    // Check link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/chapters/test-chapter");
  });

  it("shows navigation indicator", () => {
    renderWithI18n(
      <Card
        item={item}
        variant={variant}
      />
    );
    expect(screen.getByText(/Explorer/)).toBeInTheDocument();
  });
});
