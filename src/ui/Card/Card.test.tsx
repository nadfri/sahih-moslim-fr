import { render, screen } from "@testing-library/react";
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
    render(
      <Card
        item={item}
        variant={variant}
      />
    );
    // Check chapter name
    expect(screen.getByText("Test Chapter")).toBeInTheDocument();
    // Check hadith count
    expect(screen.getByText(/42 Hadiths/)).toBeInTheDocument();
    // Check chapter index
    expect(screen.getByTestId("chapter-index")).toHaveTextContent("3");
    // Check link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/chapters/test-chapter");
  });

  it("shows navigation indicator", () => {
    render(
      <Card
        item={item}
        variant={variant}
      />
    );
    expect(screen.getByText(/Explorer/)).toBeInTheDocument();
  });
});
